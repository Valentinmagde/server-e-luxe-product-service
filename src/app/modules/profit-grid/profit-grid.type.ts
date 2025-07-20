export default interface ProfitGridType {
  min_amount: number;
  max_amount: number;
  gross_rate: number;
  deduction_rate: number;
  net_rate: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
}
