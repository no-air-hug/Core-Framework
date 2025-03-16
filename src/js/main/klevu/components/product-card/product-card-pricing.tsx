import React, { useMemo } from "react";
import type { KlevuRecord } from "@klevu/core";
import he from "he";

import { formatMoney } from "../../../../utils/shopify";

type Props = {
  product: KlevuRecord;
  range: boolean;
};

const ProductCardPricing: React.FC<Props> = ({ product, range }) => {
  const priceInCents = useMemo(
    () => Number(product.price) * 100,
    [product.price],
  );
  const startPriceInCents = useMemo(
    () => Number(product.startPrice) * 100,
    [product.startPrice],
  );
  const salePriceInCents = useMemo(
    () => Number(product.salePrice) * 100,
    [product.salePrice],
  );

  const price = useMemo(
    () => formatMoney({ cents: priceInCents }),
    [priceInCents],
  );
  const startPrice = useMemo(
    () => formatMoney({ cents: startPriceInCents }),
    [startPriceInCents],
  );
  const salePrice = useMemo(
    () => formatMoney({ cents: salePriceInCents }),
    [salePriceInCents],
  );

  const priceComponent = () => {
    return salePriceInCents === priceInCents ? (
      /* Sale price being the same as the price means the product isn't on sale */
      <p className="text-xs text-black 4xl:text-[1.3rem]">{price}</p>
    ) : (
      /* Sale price not being the same as the price means the product is on sale */
      <>
        <p className="text-xs text-compare line-through 4xl:text-[1.3rem]">
          {price}
        </p>
        <p className="text-xs text-sale 4xl:text-[1.3rem]">{salePrice}</p>
      </>
    );
  };

  const varyingPriceComponent = () => {
    return salePriceInCents === priceInCents ? (
      /* Sale price being the same as the price means the product isn't on sale */
      <p className="text-xs text-black 4xl:text-[1.3rem]">
        {range
          ? `${startPrice} - ${price}`
          : he.decode(
              Klevu.i18n.product_card.pricing.from_price.replace(
                "{{ price }}",
                startPrice,
              ),
            )}
      </p>
    ) : (
      /* Sale price not being the same as the price means the product is on sale */
      <>
        <p className="text-xs text-compare line-through 4xl:text-[1.3rem]">
          {range
            ? `${startPrice} - ${price}`
            : he.decode(
                Klevu.i18n.product_card.pricing.from_price.replace(
                  "{{ price }}",
                  startPrice,
                ),
              )}
        </p>
        <p className="text-xs text-sale 4xl:text-[1.3rem]">
          {range ? `${startPrice} - ${salePrice}` : salePrice}
        </p>
      </>
    );
  };

  return (
    <h6
      className={`flex gap-x-rem font-medium leading-1 tracking-1 ${
        range ? "flex-col" : "flex-row lg:flex-col xl:flex-row"
      }`}
    >
      {startPriceInCents && startPriceInCents !== priceInCents
        ? /* Start price being present means there are varying prices for this product */
          varyingPriceComponent()
        : /* Start price not being present means there are no varying prices for this product */
          priceComponent()}
    </h6>
  );
};

export default ProductCardPricing;
