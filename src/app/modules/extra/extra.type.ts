export default interface ExtraType {
  title: object;
  name: object;
  price: number;
  option: object;
  related_product: string;
  type: "Simple" | "Product" | "Custom" | "Grouped";
  group_items: string[];
  status: "show" | "hide";
  created_at?: Date;
  updated_at?: Date;
}
