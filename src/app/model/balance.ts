import { BalanceId } from './balanceId';
import { Product } from './product';
import { Location } from './location'

export class Balance {
  id: BalanceId;
  product: Product;
  location: Location;
  amount: number;
  distance?: string;
}