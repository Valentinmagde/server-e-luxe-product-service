export default interface ProductType {
  _id: string;
  product_id: string,
  sku: string;
  barcode: string;
  slug: string;
  name: string;
  title: object;
  vendor: string;
  image: Array<string>;
  brand: string;
  short_description: object;
  description: object;
  price: number;
  prices: any;
  discount: number;
  promotional_price: number;
  initial_stock: number;
  current_stock: number;
  featured: number;
  promotional: boolean;
  date_from_promo: Date;
  date_to_promo: Date;
  rating: number;
  num_reviews: number;
  reviews: Array<Review>;
  tags: Array<any>;
  tag: Array<string>;
  categories: Array<any>;
  category: any;
  variants: Array<any>;
  is_combination: boolean;
  status: "show" | "hide";
  related_products: Array<any>;
  store: string;
  shipping: Shipping;
  upsells: Array<any>;
  cross_sells: Array<any>;
  extras: Array<any>;
}

interface Review {
  name: string;
  email: string;
  comment: string;
  rating: number;
}

interface Shipping {
  weight: number;
  dimension: Dimension;
  class: string;
}

interface Dimension {
  length: number;
  width: number;
  height: number;
}
