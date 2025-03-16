import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { KlevuSearchSorting } from "@klevu/core";
import he from "he";

import { useGlobalVariables } from "../../global-variables-context";

type Props = {
  sortChange: (newSortValue: KlevuSearchSorting) => void;
};

const SortBy: React.FC<Props> = ({ sortChange }) => {
  const {
    // Sorting
    sorting,
    toggleSorting,
    // Viewports
    currentViewport,
    desktopViewports,
  } = useGlobalVariables();

  const measuringDivRef = useRef<HTMLDivElement | null>(null);

  const [selectWidth, setSelectWidth] = useState(0);

  // Measure the width of the selected option text and update the state
  useEffect(() => {
    const offset = 19;
    const width = Number(measuringDivRef.current?.offsetWidth) + offset;
    setSelectWidth(width);
  }, [sorting, measuringDivRef.current]);

  const handleSortChange = (event: ChangeEvent) => {
    const newSortValue = (event.target as HTMLInputElement)
      .value as KlevuSearchSorting;
    toggleSorting(newSortValue);
    sortChange(newSortValue);
  };

  const settings = {
    RELEVANCE: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.relevance,
      ),
    },
    PRICE_ASC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.price_asc,
      ),
    },
    PRICE_DESC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.price_desc,
      ),
    },
    NAME_ASC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.name_asc,
      ),
    },
    NAME_DESC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.name_desc,
      ),
    },
    RATING_ASC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.rating_asc,
      ),
    },
    RATING_DESC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.rating_desc,
      ),
    },
    NEW_ARRIVAL_ASC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.new_arrival_asc,
      ),
    },
    NEW_ARRIVAL_DESC: {
      active: true,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.new_arrival_desc,
      ),
    },
    // No idea what this sort is for, so it's disabled...
    ADVANCED_SORT: {
      active: false,
      translation: he.decode(
        Klevu.i18n.search_landing.facets.sort_by.options.advanced_sort,
      ),
    },
  };

  return (
    desktopViewports.includes(currentViewport) && (
      <div className="leading-2 select-chevron text-black-neutral flex select-none items-center gap-x-[1.1rem] text-base tracking-1">
        <label
          className="text-base font-bold uppercase min-w-fit tracking-1"
          htmlFor="sort"
        >
          {he.decode(Klevu.i18n.search_landing.facets.sort_by.title)}
        </label>
        <span className="font-medium">-</span>

        <div
          ref={measuringDivRef}
          className="absolute invisible w-auto h-auto nowrap"
          aria-hidden="true"
        >
          {settings[sorting].translation}
        </div>

        <select
          name="sort"
          id="sort"
          className="p-0 font-medium border-0 cursor-pointer rounded-0"
          onChange={handleSortChange}
          value={sorting}
          style={{ width: `${selectWidth}px` }}
        >
          {Object.entries(KlevuSearchSorting).map(([key, value]) => {
            if (settings[value].active) {
              return (
                <option key={key} value={value}>
                  {settings[value].translation}
                </option>
              );
            }
          })}
        </select>
      </div>
    )
  );
};

export default SortBy;
