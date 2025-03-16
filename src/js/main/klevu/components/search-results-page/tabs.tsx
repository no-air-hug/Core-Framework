import React, { type ChangeEvent } from "react";
import type { KlevuTypeOfRecord } from "@klevu/core";
import he from "he";

import { config } from "../../config";
import { useGlobalVariables } from "../../global-variables-context";

const Tabs: React.FC = () => {
  const searchRecords = config.searchRecords.map((n) => n);

  const {
    // Response
    response,
    // Tabs
    currentTab,
    toggleTab,
    // Debugging
    designMode,
    toggleDebugMode,
  } = useGlobalVariables();

  const handleTabChange = (event: ChangeEvent) => {
    const newTabValue = (event.target as HTMLInputElement)
      .value as KlevuTypeOfRecord;
    toggleTab(newTabValue);
  };

  return (
    <div className="flex gap-x-4">
      {searchRecords.map((searchRecord, index) => {
        // TODO: Tab specific results count.
        const resultsCount = response?.query.meta.totalResultsFound;

        return (
          <label className="relative flex cursor-pointer" key={index}>
            <p
              className={`leading-2 relative cursor-pointer select-none pb-[0.6rem] text-sm font-medium tracking-1 text-black hover:border-b hover:border-solid hover:border-black lg:text-base ${
                currentTab === searchRecord.record
                  ? "border-b border-solid border-black"
                  : ""
              } `}
            >
              {searchRecord.label}
            </p>

            <span className="absolute font-medium text-center select-none -right-1 -top-2 text-2xs tracking-1">
              {resultsCount}
            </span>

            <input
              type="radio"
              id="tab"
              name="tab"
              value={searchRecord.record as KlevuTypeOfRecord}
              className="hidden"
              onChange={handleTabChange}
            />
          </label>
        );
      })}

      {designMode && (
        <div className="o-input">
          <label htmlFor="klevu-debug-toggler">
            {he.decode(Klevu.i18n.debug)}
          </label>
          <input
            className="o-input__checkbox"
            type="checkbox"
            name="klevu-debug-toggler"
            id="klevu-debug-toggler"
            onChange={(e) => {
              toggleDebugMode(e.target.checked);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tabs;
