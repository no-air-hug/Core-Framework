import React from "react";

import { config } from "../../config";
import { useGlobalVariables } from "../../global-variables-context";
import ProductCard from "../product-card/product-card";

const ProdutGrid: React.FC = () => {
  // Grid Columns
  const gridColumnViews = config.grid.columns.views;
  const { currentGridColumnView, currentViewport, results } =
    useGlobalVariables();
  const template = gridColumnViews[currentGridColumnView];
  const view = template[currentViewport];

  const viewClasses = ["grid-cols-1", "grid-cols-2", "grid-cols-3"];
  const viewClass = viewClasses[view - 1];

  return (
    <ul
      className={`grid ${viewClass} w-full gap-x-[0.9rem] gap-y-[1.8rem] pt-5 md:gap-x-[4rem] md:gap-y-5 lg:gap-x-5 lg:gap-y-[4rem] lg:pt-[4rem] 4xl:gap-[4rem]`}
    >
      {results.map((p, i) => (
        <li key={i}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
};

export default ProdutGrid;
