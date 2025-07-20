export default interface ExchangeRateType {
  _id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  fee_percentage: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
}
