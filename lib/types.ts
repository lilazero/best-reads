export interface Tag {
  icon?: string;
  id: string;
  value: string;
}
export type Book = {
  id: string;
  title: string;
  src?: string;
  price?: string;
  rating?: number;
  description?: string;
  longDescription?: string;
  tags?: Tag[];
};
