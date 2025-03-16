import React from "react";
import type { KlevuRecord } from "@klevu/core";

type Props = {
  product: KlevuRecord;
};

const ProductCardStickers: React.FC<Props> = ({ product }) => {
  const stickers = product.tags
    ? product.tags.split(",").filter((t) => t.includes("badge_"))
    : [];

  if (stickers.length > 0) {
    return (
      <ul className="absolute z-1 flex flex-wrap gap-1 pl-[0.5rem] pt-[0.5rem]">
        {stickers.map((sticker) => {
          const sanitisedSticker = sticker
            .replace("badge_", "")
            .replaceAll("-", " ")
            .trim();

          return (
            <li
              className="flex items-center rounded-[0.5rem] border border-solid bg-white px-[1.3rem] py-2 text-xs font-bold uppercase leading-1"
              key={sticker}
            >
              {sanitisedSticker}
            </li>
          );
        })}
      </ul>
    );
  }
};

export default ProductCardStickers;
