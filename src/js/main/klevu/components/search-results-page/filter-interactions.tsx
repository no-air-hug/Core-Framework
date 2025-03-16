import React, { useEffect } from "react";
import type { FilterManager } from "@klevu/core";
import he from "he";

import { useGlobalVariables } from "../../global-variables-context";
import IconFilter from "../../svgs/icon-filter.svg";

type Props = {
  filterManager: FilterManager;
};

const FilterInteractions: React.FC<Props> = ({ filterManager }) => {
  const {
    currentViewport,
    mobileViewports,
    desktopViewports,
    filterDisplayState,
    toggleFilterDisplayState,
  } = useGlobalVariables();

  // Initial drawer presentation
  useEffect(() => {
    // Starts open by default on desktop, but not on mobile
    if (desktopViewports.includes(currentViewport)) {
      toggleFilterDisplayState(true);
    }
  }, []);

  // Ensures the desktop drawer stylings are reset on viewport change.
  useEffect(() => {
    if (mobileViewports.includes(currentViewport) && filterDisplayState) {
      toggleFilterDisplayState(false);
    }
  }, [currentViewport]);

  return (
    <div className="flex cursor-pointer items-center gap-x-[2.2rem] lg:py-[0.5rem]">
      <button
        type="button"
        className="flex h-[4.4rem] cursor-pointer select-none items-center gap-x-[0.9rem] bg-transparent p-0 lg:gap-x-[0.5rem]"
        onClick={() => {
          toggleFilterDisplayState(!filterDisplayState);
        }}
      >
        <span className="flex items-center justify-center lg:h-[4.4rem] lg:w-[4.4rem]">
          <IconFilter className="h-[1.5rem] w-[1.8rem]" />
        </span>

        <span className="text-xs font-bold text-black uppercase select-none tracking-1 lg:text-base">
          {he.decode(Klevu.i18n.search_landing.facets.filters.title)}
        </span>
      </button>

      {desktopViewports.includes(currentViewport) && (
        <button
          className="cursor-pointer select-none bg-transparent px-0 pb-0 pt-px text-[1.3rem] font-bold uppercase tracking-1 underline underline-offset-2 hover:no-underline"
          type="button"
          onClick={() => {
            filterManager.clearOptionSelections();
          }}
        >
          {he.decode(Klevu.i18n.search_landing.facets.filters.clear_filters)}
        </button>
      )}
    </div>
  );
};

export default FilterInteractions;
