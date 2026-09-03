export interface PaymentGatewayInterface {
  /**
   * Creates a customer object in the payment gateway (e.g. Stripe Customer)
   */
  createCustomer(email: string, name: string, tenantId: string): Promise<string>;

  /**
   * Creates a new subscription for a customer
   */
  createSubscription(customerId: string, priceId: string, trialDays?: number): Promise<any>;

  /**
   * Cancels an active subscription
   */
  cancelSubscription(subscriptionId: string): Promise<boolean>;

  /**
   * Reports metered usage for billing (e.g. AI minutes or tokens)
   */
  reportUsage(subscriptionItemId: string, quantity: number, action: 'increment' | 'set'): Promise<boolean>;
}
