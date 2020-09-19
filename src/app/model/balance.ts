import { BalanceId } from './balanceId';
import { Product } from './product';

export class Balance {
  id: BalanceId;
  product: Product;
  location: Location;
  amount: number;
  distance?: string;
}