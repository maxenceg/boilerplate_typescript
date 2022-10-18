export enum Category {
    Groceries = 'Groceries',
    Travel = "Travel",
    Entertainment = "Entertainment",
    Restaurants = "Restaurants",
    Golf = "Golf"
}

export type Payment = {
  description: string;
  price: number;
  category: Category;
  userId: number;
  date: Date;
};
