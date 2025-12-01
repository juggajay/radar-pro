import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { stripe } from './client'
import type { Json } from '@/types/supabase'


// Admin client with service role - bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Upsert product from Stripe webhook
export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata as Json,
  }

  const { error } = await supabaseAdmin.from('products').upsert([productData] as any)
  if (error) throw error
  console.log(`Product inserted/updated: ${product.id}`)
}

// Upsert price from Stripe webhook
export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : price.product.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type as 'one_time' | 'recurring',
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata as Json,
  }

  const { error } = await supabaseAdmin.from('prices').upsert([priceData] as any)
  if (error) throw error
  console.log(`Price inserted/updated: ${price.id}`)
}

// Delete product
export const deleteProductRecord = async (product: Stripe.Product) => {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', product.id)
  if (error) throw error
  console.log(`Product deleted: ${product.id}`)
}

// Delete price
export const deletePriceRecord = async (price: Stripe.Price) => {
  const { error } = await supabaseAdmin.from('prices').delete().eq('id', price.id)
  if (error) throw error
  console.log(`Price deleted: ${price.id}`)
}

// Create or retrieve Stripe customer
export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string
  uuid: string
}) => {
  // Check if customer exists in our database
  const { data: existingCustomer, error: queryError }: any = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .maybeSingle()

  if (queryError) throw queryError

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabaseUUID: uuid },
  })

  // Save mapping to database
  const { error: insertError }: any = await supabaseAdmin
    .from('customers')
    .insert([{ id: uuid, stripe_customer_id: customer.id }] as any)

  if (insertError) throw insertError

  console.log(`New customer created: ${customer.id}`)
  return customer.id
}

// Copy billing details from payment method to customer
export const copyBillingDetailsToCustomer = async (
  uuid: string,
  paymentMethod: Stripe.PaymentMethod
) => {
  const customer = paymentMethod.customer as string
  const { name, phone, address } = paymentMethod.billing_details

  if (!name || !address) return

  // Update Stripe customer
  await stripe.customers.update(customer, {
    name,
    phone: phone ?? undefined,
    address: address as Stripe.AddressParam
  })

  // Update our database
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address } as Json,
      payment_method: paymentMethod as unknown as Json,
    } as any)
    .eq('id', uuid)

  if (error) throw error
}

// Handle subscription status changes
export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get user UUID from customer ID
  const { data: customerData, error: customerError }: any = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (customerError) throw customerError

  const { id: uuid } = customerData

  // Get full subscription details from Stripe
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  })

  // Prepare data for our database
  const subscriptionData = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata as Json,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    current_period_start: new Date(
      subscription.current_period_start * 1000
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000
    ).toISOString(),
    created: new Date(subscription.created * 1000).toISOString(),
    ended_at: subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  }

  // Upsert to database
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData] as any)

  if (error) throw error

  console.log(`Subscription ${createAction ? 'created' : 'updated'}: ${subscription.id}`)

  // Copy billing details on new subscription
  if (createAction && subscription.default_payment_method) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    )
  }
}
