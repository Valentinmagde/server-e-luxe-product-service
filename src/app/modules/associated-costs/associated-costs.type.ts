export default interface AssociatedCostType {
  title: TranslateType;
  status: string;
  amount: number;
  currency: string;
  description?: TranslateType;
  amount_type: string;
  percentage?: number;
}

interface TranslateType{
  fr: string;
  en: string;
}
