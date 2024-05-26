export interface PremiumPricingTable {
  load(): Promise<object[]>;
}