export interface PaymentSummary {
  totalOverall: number;
  totalsByType: {
    GAS: number;
    FOOD: number;
    PERSONAL: number;
    OTHER: number;
    [key: string]: number; // in case you extend types later
  };
  // You can extend to include totalsByUser if your endpoint returns it
}
