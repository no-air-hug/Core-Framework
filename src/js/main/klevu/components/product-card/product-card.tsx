import React, { useState } from "react";
import { KlevuEvents, type KlevuRecord } from "@klevu/core";

import useQuery from "../../hooks/use-query";
import ProductCardDebug from "./product-card-debug";
import ProductCardImage from "./product-card-image";
import ProductCardPricing from "./product-card-pricing";
import ProductCardStickers from "./product-card-stickers";
import ProductCardSwatches from "./product-card-swatches";

type Props = {
  product: KlevuRecord;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  const query = useQuery();

  const name = product.name.split("*")[0];
  const url = `/products/${product.url.split("/products/")[1]}`;

  const [productCardImageOverride, setProductCardImageOverride] =
    useState<string>("");

  // Events
  const handleClick = () => {
    KlevuEvents.searchProductClick({
      searchTerm: String(query.get("q")),
      product: product,
    });

    window.location.href = url;
  };

  return (
    <div className="relative flex w-full flex-col gap-y-[0.5rem] text-black">
      <a
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
        href={url}
      >
        <ProductCardStickers product={product} />
        <ProductCardImage
          image={product.image}
          imageHover={product.imageHover}
          imageOverride={productCardImageOverride}
        />
      </a>

      <div className="flex animate-fade-in flex-col gap-y-[0.5rem]">
        <a
          className="cursor-pointer"
          data-original-name={product.name}
          onClick={handleClick}
          href={url}
        >
          <h3 className="text-[1.3rem] font-bold leading-1 4xl:text-base">
            {name}
          </h3>
        </a>

        <ProductCardPricing product={product} range={true} />

        <ProductCardSwatches
          product={product}
          url={url}
          swatchMouseEnterInteraction={(swatch: KlevuSwatchDetails) => {
            if (swatch.image) setProductCardImageOverride(swatch.image);
          }}
          swatchMouseLeaveInteraction={() => {
            setProductCardImageOverride("");
          }}
        />
      </div>

      <ProductCardDebug product={product} />
    </div>
  );
};

export default ProductCard;
