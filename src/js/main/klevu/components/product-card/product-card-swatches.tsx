import React from "react";
import { KlevuEvents, type KlevuRecord } from "@klevu/core";
import he from "he";

import useQuery from "../../hooks/use-query";

type Props = {
  product: KlevuRecord;
  swatchMouseEnterInteraction: (swatch: KlevuSwatchDetails) => void;
  swatchMouseLeaveInteraction: (swatch: KlevuSwatchDetails) => void;
  url: string;
};

const ProductCardSwatches: React.FC<Props> = ({
  product,
  swatchMouseEnterInteraction,
  swatchMouseLeaveInteraction,
  url,
}) => {
  const query = useQuery();

  const { utilisation } = Klevu.settings.swatches;
  const swatchesInfo = product.swatchesInfo.split(" ;;;; ");

  const variantColours = swatchesInfo.filter((swatchInfo) => {
    const colour = swatchInfo.split(":")[1];

    if (colour && swatchInfo.includes("variantColor")) {
      return swatchInfo;
    }
  });

  if (variantColours.length === 0) return <></>;

  // Events
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    KlevuEvents.searchProductClick({
      searchTerm: String(query.get("q")),
      product,
    });

    window.location.href = url;
  };

  const handleVariantClick = (
    event: React.MouseEvent,
    variantId: string,
    variantUrl: string,
  ) => {
    event.preventDefault();

    KlevuEvents.searchProductClick({
      searchTerm: String(query.get("q")),
      product,
      variantId,
    });

    window.location.href = variantUrl;
  };

  return (
    <>
      <ul className="flex gap-x-rem py-[0.5rem]">
        {variantColours.map((s, index) => {
          if (
            Klevu.settings.swatches.limit > 0 &&
            index >= Klevu.settings.swatches.limit
          )
            return;
          const number = s.split(":")[0]?.replace("variantColor", "");

          // Id
          const id = swatchesInfo
            .find((s) => s.includes(`variantId${number}:`))
            ?.split(":")[1];

          // Colour
          const colour = s.split(":")[1];
          if (!colour) return <></>;

          // Images
          let image = swatchesInfo.find((s) =>
            s.includes(`variantImage${number}:`),
          );
          const fallbackPlaceholderImage =
            "data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 3.414 28.586 2 2 28.586 3.414 30l2-2H26a2.003 2.003 0 0 0 2-2V5.414ZM26 26H7.414l7.793-7.793 2.379 2.379a2 2 0 0 0 2.828 0L22 19l4 3.997Zm0-5.832-2.586-2.586a2 2 0 0 0-2.828 0L19 19.168l-2.377-2.377L26 7.414ZM6 22v-3l5-4.997 1.373 1.374 1.416-1.416-1.375-1.375a2 2 0 0 0-2.828 0L6 16.172V6h16V4H6a2 2 0 0 0-2 2v16Z'/%3E%3Cpath data-name='&lt;Transparent Rectangle&gt;' style='fill: none' d='M0 0h32v32H0z'/%3E%3C/svg%3E";
          image = image
            ? image.split(`variantImage${number}:`)[1]
            : fallbackPlaceholderImage;

          const itemClasses =
            "relative h-[1.3rem] w-[1.3rem] rounded-full border border-solid border-border-light bg-contain hover:border-black";

          const swatch = {
            id,
            colour,
            image,
          } as KlevuSwatchDetails;

          return (
            <li
              key={index}
              className={itemClasses}
              {...(utilisation === "variant-images"
                ? {
                    style: { backgroundImage: `url(${image})` },
                    onMouseEnter: () => {
                      swatchMouseEnterInteraction(swatch);
                    },
                    onMouseLeave: () => {
                      swatchMouseLeaveInteraction(swatch);
                    },
                  }
                : {
                    "data-swatch": colour.toLowerCase().replaceAll(" ", "-"),
                  })}
            >
              <a
                onClick={(event) => {
                  if (id) handleVariantClick(event, id, `${url}?variant=${id}`);
                }}
                href={id ? `${url}?variant=${id}` : ""}
                className="absolute inset-0 w-full h-full"
                title={
                  image
                    ? colour
                    : he.decode(
                        Klevu.i18n.product_card.swatches.swatch_image_missing_error.replace(
                          "{{ colour }}",
                          colour,
                        ),
                      )
                }
              />
            </li>
          );
        })}
      </ul>
      {variantColours.length > Klevu.settings.swatches.limit && (
        <a
          className="text-xs font-bold tracking-1 text-grey-50"
          onClick={handleClick}
          href={url}
        >
          {he.decode(Klevu.i18n.product_card.swatches.more_options)}
        </a>
      )}
    </>
  );
};

export default ProductCardSwatches;
