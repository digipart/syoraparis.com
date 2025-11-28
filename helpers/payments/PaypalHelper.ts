import { PaymentHelper } from './PaymentHelper';

export default class PaypalHelper extends PaymentHelper {
  get basket() {
    const baskets: {
      name: string | undefined;
      description: string;
      unit_amount: {
        currency_code: string | undefined;
        value: number | undefined;
      };
      quantity: number | undefined;
    }[] = [];

    this.cart?.Products?.map((item) => {
      const quantity = item?.Quantity;
      let promotionalPrice = item?.Price?.PromotionalPrice;
      let regularPrice = item?.Price?.RegularPrice;
      let price = regularPrice;

      if (promotionalPrice) {
        price = promotionalPrice;
      }

      const newItem = {
        name: item?.Description?.Title,
        description: `Ref :${item?.Reference}`,
        unit_amount: {
          currency_code: this.cart?.Currency?.IsoCode,
          value: price?.PriceTaxIncl,
        },
        quantity: quantity,
      };

      baskets.push(newItem);
    });

    return baskets;
  }
}
