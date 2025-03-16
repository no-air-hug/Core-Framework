import React from "react";
import he from "he";

import { useGlobalVariables } from "../../global-variables-context";
import SearchInput from "./search-input";

const NoResultsHeader: React.FC = () => {
  const { response } = useGlobalVariables();

  if (response) {
    return (
      <>
        <div className="flex flex-col pb-6 px-row">
          <SearchInput />

          <div className="flex items-center justify-center min-h-18">
            <h3 className="text-base font-bold text-black pr-9 leading-1">
              {he.decode(
                Klevu.i18n.search_landing.no_results.replace(
                  "{{ count }}",
                  String(response.query.meta.searchedTerm),
                ),
              )}
            </h3>
          </div>
        </div>
      </>
    );
  }
};

export default NoResultsHeader;
