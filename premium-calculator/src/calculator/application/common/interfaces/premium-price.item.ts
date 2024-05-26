export interface IPremiumPriceItem {
  carrier: string;
  plan: string;
  state: string;
  month_of_birth: string;
  age_range: {
    min: number;
    max: number;
  },
  premium: number;
}