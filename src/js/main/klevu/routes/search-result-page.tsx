import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  applyFilterWithManager,
  debug,
  FilterManager,
  KlevuDomEvents,
  KlevuEvents,
  KlevuFetch,
  KlevuListenDomEvent,
  KlevuSearchPreference,
  listFilters,
  search,
  type KlevuAnyTypeOfRecord,
  type KlevuFetchQueriesWithOptions,
  type KlevuSearchSorting,
} from "@klevu/core";
import he from "he";

import Drawer from "../components/general/drawer";
import LoadingIndicator from "../components/general/loading-indicator";
import Facets from "../components/search-results-page/facets";
import FilterList from "../components/search-results-page/filter-list";
import Header from "../components/search-results-page/header";
import NoResultsHeader from "../components/search-results-page/no-results-header";
import Pagination from "../components/search-results-page/pagination";
import ProductGrid from "../components/search-results-page/product-grid";
import { config } from "../config";
import { useGlobalVariables } from "../global-variables-context";
import useQuery from "../hooks/use-query";
import useRedirects from "../hooks/use-redirects";

const manager = new FilterManager();

const SearchResultPage: React.FC = () => {
  const searchRecords = config.searchRecords.map((n) => n);
  const searchId = useRef("");
  const query = useQuery();

  const {
    // Results & Response
    results,
    setResults,
    response,
    setResponse,
    // Viewports
    desktopViewports,
    currentViewport,
    // Filters
    filterDisplayState,
    // Sorting,
    sorting,
    toggleSorting,
    // Debug
    debugMode,
    designMode,
  } = useGlobalVariables();

  // Loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination
  const [showMore, setShowMore] = useState(false);

  const performFetch = useCallback(async () => {
    const records: KlevuAnyTypeOfRecord[] = [];
    searchRecords.map((searchRecord) =>
      records.push(searchRecord.record as KlevuAnyTypeOfRecord),
    );

    const modifiers = [
      listFilters({
        exclude: ["type"],
        rangeFilterSettings: [
          {
            key: "klevu_price",
            minMax: true,
          },
        ],
        filterManager: manager,
      }),
      applyFilterWithManager(manager),
      ...(debugMode && designMode ? [debug()] : []),
    ];

    searchId.current = "search-query";

    const functions: KlevuFetchQueriesWithOptions = [
      search(
        String(query.get("q")),
        {
          id: searchId.current,
          typeOfRecords: records,
          limit: 36,
          sort: sorting,
          ...(debugMode && designMode
            ? { searchPrefs: [KlevuSearchPreference.debugQuery] }
            : {}),
        },
        ...modifiers,
      ),
    ];

    const res = await KlevuFetch(...functions);

    const currentResults = res.queriesById(searchId.current);
    await useRedirects(currentResults);

    setResponse(currentResults);
    setShowMore(currentResults.hasNextPage());
    setResults(currentResults.records);
    setIsLoading(false);

    // Events
    KlevuEvents.search({
      term: currentResults.query.meta.searchedTerm,
      totalResults: currentResults.query.meta.totalResultsFound,
      typeOfSearch: currentResults.query.meta.typeOfSearch,
    });
  }, [sorting, query]);

  const fetchMore = async () => {
    const nextResponse = await response?.getPage({
      filterManager: manager,
    });

    const nextSearchResult = nextResponse?.queriesById(searchId.current);

    setResults([...results, ...(nextSearchResult?.records ?? [])]);
    if (nextSearchResult) setResponse(nextSearchResult);
    if (nextSearchResult) setShowMore(nextSearchResult.hasNextPage());
  };

  const handleSortUpdate = (newSortValue: KlevuSearchSorting) => {
    query.set("sorting", newSortValue);

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${query.toString()}`,
    );

    toggleSorting(newSortValue);
  };

  // Initial fetch, also reads filters from the url
  useEffect(() => {
    manager.readFromURLParams(new URL(document.URL).searchParams);
  }, []);

  // Updates product list when filters are interacted with.
  useEffect(() => {
    const onUpdate = KlevuListenDomEvent(
      KlevuDomEvents.FilterSelectionUpdate,
      () => {
        const searchParams = manager.toURLParams(
          new URL(document.URL).searchParams,
        );

        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}?${searchParams}`,
        );

        void performFetch();
      },
    );

    return () => {
      onUpdate();
    };
  }, [query]);

  // Other updates to the product list, updates the returned products when the query or sorting method is changed
  useEffect(() => {
    void performFetch();
  }, [sorting, query]);

  const hasResults = Number(response?.query.meta.totalResultsFound) > 0;
  return (
    <div className="mt-[0.2rem] min-h-[7.7rem] pt-[2.5rem] max-lg:border-t max-lg:border-solid max-lg:border-border-light">
      {isLoading && (
        <div className="flex h-full min-h-[46rem] w-full items-center justify-center">
          <LoadingIndicator size={50} />
        </div>
      )}

      {hasResults ? (
        <>
          <Header />
          <Facets filterManager={manager} sortChange={handleSortUpdate} />
          <div id="main" className="px-row">
            <div className="flex">
              {desktopViewports.includes(currentViewport) ? (
                <div
                  className="mb-[9rem] w-full overflow-hidden"
                  style={{
                    maxWidth: filterDisplayState ? "313px" : "0px",
                    transition:
                      "max-width 1s ease-in-out, opacity 0.5s ease-in-out",
                    opacity: filterDisplayState ? 1 : 0,
                  }}
                >
                  <div className="lg:mr-[4rem] lg:h-[calc(100%-1px)] lg:border-b lg:border-solid lg:border-border-light 4xl:mr-[5.4rem]">
                    <div className="w-full whitespace-nowrap lg:px-0 lg:py-[4rem]">
                      <h5 className="flex cursor-default items-center justify-between py-[1.4rem] text-2xl font-bold leading-1">
                        <span>
                          {he.decode(
                            Klevu.i18n.search_landing.facets.filters.title,
                          )}
                        </span>
                      </h5>
                      <hr className="o-hr" />
                      <FilterList filterManager={manager} />
                    </div>
                  </div>
                </div>
              ) : (
                <Drawer
                  title={he.decode(
                    Klevu.i18n.search_landing.facets.filters.title,
                  )}
                  accessibilityTitle={he.decode(
                    Klevu.i18n.search_landing.facets.filters.dialog
                      .accessibility.title,
                  )}
                  accessibilityDescription={he.decode(
                    Klevu.i18n.search_landing.facets.filters.dialog
                      .accessibility.description,
                  )}
                  main={<FilterList filterManager={manager} />}
                />
              )}

              <div className="w-full pb-[9rem]">
                <ProductGrid />
                <Pagination
                  onClick={() => void fetchMore()}
                  visible={showMore}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <NoResultsHeader />
      )}
    </div>
  );
};

export default SearchResultPage;
