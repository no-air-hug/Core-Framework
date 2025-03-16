import React from "react";
import { KlevuEvents, type KlevuRecord } from "@klevu/core";

import useQuery from "../../hooks/use-query";
import ProductCardDebug from "./product-card-debug";
import ProductCardImage from "./product-card-image";
import ProductCardPricing from "./product-card-pricing";

type Props = {
  product: KlevuRecord;
};

const ProductCardSimple: React.FC<Props> = ({ product }) => {
  const query = useQuery();

  const name = product.name.split("*")[0];
  const url = `/products/${product.url.split("/products/")[1]}`;

  // Events
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    KlevuEvents.searchProductClick({
      searchTerm: String(query.get("q")),
      product,
    });

    window.location.href = url;
  };

  return (
    <a
      className="relative grid h-full w-full cursor-pointer grid-rows-[auto_1fr] gap-y-[0.5rem] text-black"
      onClick={handleClick}
      href={url}
    >
      <div className="w-full h-full">
        <ProductCardImage
          image={product.image}
          imageHover={product.imageHover}
        />
      </div>

      <div className="flex flex-col animate-fade-in gap-y-4">
        <div className="flex flex-col h-full gap-y-rem">
          <h3 className="text-[1.3rem] font-bold leading-1 4xl:text-base">
            {name}
          </h3>

          <ProductCardPricing product={product} range={false} />
        </div>
      </div>

      <ProductCardDebug product={product} />
    </a>
  );
};

export default ProductCardSimple;
