import React from "react";
import type { FilterManager, KlevuSearchSorting } from "@klevu/core";
import he from "he";

import { useGlobalVariables } from "../../global-variables-context";
import FilterInteractions from "./filter-interactions";
import SortBy from "./sort-by";
import View from "./view";

type Props = {
  filterManager: FilterManager;
  sortChange: (newSortValue: KlevuSearchSorting) => void;
};

const Facets: React.FC<Props> = ({ filterManager, sortChange }) => {
  const handleSortChange = (newSortValue: KlevuSearchSorting) => {
    sortChange(newSortValue);
  };

  const {
    // Record & Results
    results,
    // Viewports
    currentViewport,
    mobileViewports,
  } = useGlobalVariables();

  return (
    <div className="border-b border-solid border-border-light pb-3 pt-[0.9rem] lg:py-3 4xl:border-t">
      <div className="px-row">
        <div className="flex items-center justify-between">
          <div className="max-lg:w-[9.2rem]">
            <FilterInteractions filterManager={filterManager} />
          </div>

          {mobileViewports.includes(currentViewport) && results.length > 0 && (
            <p className="text-base font-normal leading-1 tracking-1">
              {results.length === 1
                ? he.decode(
                    Klevu.i18n.search_landing.facets.results.one.replace(
                      "{{ count }}",
                      String(results.length),
                    ),
                  )
                : he.decode(
                    Klevu.i18n.search_landing.facets.results.multiple.replace(
                      "{{ count }}",
                      String(results.length),
                    ),
                  )}
            </p>
          )}

          <div className="flex justify-end gap-x-[5.3rem] max-lg:w-[9.2rem]">
            <View />
            <SortBy sortChange={handleSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facets;
