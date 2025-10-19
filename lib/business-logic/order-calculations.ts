export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderCalculation {
  totalCost: number;
  downPaymentRequired: number;
  remainingBalance: number;
}

export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
}

export function calculateDownPayment(totalCost: number): number {
  return totalCost * 0.5;
}

export function calculateRemainingBalance(totalCost: number, downPaymentReceived: number): number {
  return totalCost - downPaymentReceived;
}

export function calculateFullOrder(items: OrderItem[]): OrderCalculation {
  const totalCost = calculateOrderTotal(items);
  const downPaymentRequired = calculateDownPayment(totalCost);
  const remainingBalance = totalCost - downPaymentRequired;

  return {
    totalCost,
    downPaymentRequired,
    remainingBalance,
  };
}

export function validateDownPayment(totalCost: number, downPaymentReceived: number): {
  isValid: boolean;
  error?: string;
} {
  const required = calculateDownPayment(totalCost);

  if (downPaymentReceived !== required) {
    return {
      isValid: false,
      error: `Down payment must be exactly 50% of the total cost (${required.toFixed(2)})`,
    };
  }

  return { isValid: true };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  }).format(amount);
}
