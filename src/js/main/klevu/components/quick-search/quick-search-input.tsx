import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KlevuEvents,
  KlevuFetch,
  KlevuSearchPreference,
  KlevuTypeOfRecord,
  search,
  suggestions,
  trendingProducts,
  type KlevuResponseQueryObject,
  type KlevuSuggestionResult,
} from "@klevu/core";
import he from "he";

import { debounce, get } from "../../../../utils";
import { config } from "../../config";
import { useGlobalVariables } from "../../global-variables-context";
import useRedirects from "../../hooks/use-redirects";
import IconSearch from "../../svgs/icon-search.svg";
import Logo from "./logo";
import QuickSearchResults from "./quick-search-results";
import QuickSearchTriggerClose from "./quick-search-trigger-close";

const QuickSearchInput: React.FC = () => {
  const desktopTrigger = get("#klevu-quick-search-trigger-desktop");
  const mobileTrigger = get("#klevu-quick-search-trigger-mobile");

  const [isOpen, setIsOpen] = useState(false);

  const searchRecords = config.searchRecords.map((n) => n);

  const trendingProductsId = useRef("");
  const suggestionsId = useRef("");
  const searchId = useRef("");

  const moduleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    // Viewport
    currentViewport,
    mobileViewports,
    // Response
    response,
    setResponse,
    // Debug
    debugMode,
    designMode,
  } = useGlobalVariables();

  // Extra Queries
  const [responseTrendingProducts, setResponseTrendingProducts] =
    useState<KlevuResponseQueryObject>();
  const [responseSuggestions, setResponseSuggestions] =
    useState<KlevuSuggestionResult>();

  const performSearch = useCallback(async () => {
    if (!inputRef.current) return;

    const records: KlevuTypeOfRecord[] = [];
    searchRecords.map((searchRecord: KlevuRecordDetails) =>
      records.push(searchRecord.record as KlevuTypeOfRecord),
    );

    trendingProductsId.current = "quick-search-trending";
    suggestionsId.current = "quick-search-suggestions";
    searchId.current = "quick-search-query";

    const functions = [
      trendingProducts({
        id: trendingProductsId.current,
      }),
      suggestions(inputRef.current.value, {
        id: suggestionsId.current,
        limit: mobileViewports.includes(currentViewport) ? 4 : 6,
      }),
      search(inputRef.current.value, {
        id: searchId.current,
        typeOfRecords: records,
        limit: 5,
        ...(debugMode && designMode
          ? { searchPrefs: [KlevuSearchPreference.debugQuery] }
          : {}),
      }),
    ];

    const res = await KlevuFetch(...functions);

    const trendingProductsResponse = res.queriesById(
      trendingProductsId.current,
    );
    setResponseTrendingProducts(trendingProductsResponse);

    const suggestionsResponse = res.suggestionsById(suggestionsId.current);
    if (suggestionsResponse) setResponseSuggestions(suggestionsResponse);

    const searchResponse = res.queriesById(searchId.current);
    await useRedirects(searchResponse);

    setResponse(searchResponse);

    // Events
    KlevuEvents.search({
      term: searchResponse.query.meta.searchedTerm,
      totalResults: searchResponse.query.meta.totalResultsFound,
      typeOfSearch: searchResponse.query.meta.typeOfSearch,
    });
  }, [inputRef.current?.value, debugMode, designMode, searchRecords]);

  const handleTriggerClick = useCallback(() => {
    if (inputRef.current) {
      // Reset the input value
      inputRef.current.value = "";

      // Focus the input
      inputRef.current.focus();
    }

    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const checkIfClickedOutsideModule = useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;

      if (!moduleRef.current) return;
      const module = moduleRef.current;
      const form = module.closest("form");
      const results = form?.nextElementSibling;

      if (
        !form?.contains(target) && // If they aren't clicking the input...
        !results?.contains(target) && // If they aren't clicking in the results area.
        !moduleRef.current.contains(target) && // If the click doesn't come from inside the module...
        !desktopTrigger?.contains(target) && // If they aren't clicking the desktop trigger..
        !mobileTrigger?.contains(target) && // If they aren't clicking the mobile trigger..
        isOpen // If the module is open...
      ) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  useEffect(() => {
    desktopTrigger?.addEventListener("click", handleTriggerClick);
    mobileTrigger?.addEventListener("click", handleTriggerClick);
    document.body.addEventListener("click", checkIfClickedOutsideModule);

    return () => {
      desktopTrigger?.removeEventListener("click", handleTriggerClick);
      mobileTrigger?.removeEventListener("click", handleTriggerClick);
      document.body.removeEventListener("click", checkIfClickedOutsideModule);
    };
  }, [handleTriggerClick, checkIfClickedOutsideModule]);

  // Initial Fetch
  useEffect(() => {
    void performSearch();
  }, []);

  return (
    <>
      <form
        className="absolute inset-0 z-50 w-full transition-opacity duration-200"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        action="/search"
        method="get"
        role="search"
        itemProp="potentialAction"
        itemScope
        itemType="https://schema.org/SearchAction"
      >
        <div
          className="absolute z-50 flex items-center w-full bg-white top-promo h-header gap-x-rem px-row"
          ref={moduleRef}
          aria-hidden={isOpen ? "false" : "true"}
        >
          <div className="flex items-center w-full h-10 py-6 gap-x-5">
            <a
              className="w-full select-none max-lg:hidden lg:max-w-[11rem] 4xl:max-w-[13.2rem]"
              href="/"
              itemProp="url"
              title="Homepage"
            >
              <Logo />
            </a>

            <div className="no-autofill-bg flex w-full items-center rounded-1 border border-solid border-grey-20 bg-white pl-[1.4rem]">
              <meta itemProp="target" content="/search?q={q}" />
              <label htmlFor="search-input" className="sr-only">
                {he.decode(Klevu.i18n.quick_search.input.accessibility)}
              </label>
              <input
                className="p-y h-full w-full border-0 pl-0 pr-[1.4rem] text-[1.3rem] font-medium tracking-1 text-grey-50"
                name="q"
                itemProp="query-input"
                type="search"
                id="search-input"
                placeholder={he.decode(
                  Klevu.i18n.quick_search.input.placeholder,
                )}
                required
                onChange={debounce(() => performSearch(), 200)}
                ref={inputRef}
                autoComplete="off"
              />

              <button
                className="flex h-[4.4rem] w-[4.4rem] cursor-pointer items-center justify-center bg-grey-20 p-0"
                aria-label={he.decode(
                  Klevu.i18n.quick_search.submit.accessibility,
                )}
                type="submit"
              >
                <IconSearch className="h-[1.7rem] w-[1.7rem] fill-white" />
                <span className="sr-only">
                  {he.decode(Klevu.i18n.quick_search.submit.accessibility)}
                </span>
              </button>
            </div>

            <QuickSearchTriggerClose onClick={handleTriggerClick} />
          </div>
        </div>
      </form>

      <QuickSearchResults
        response={response}
        responseTrending={responseTrendingProducts}
        responseSuggestions={responseSuggestions}
        responseSuggestionInteraction={() => void performSearch()}
        inputEl={inputRef.current}
        isOpen={isOpen}
      />
    </>
  );
};

export default QuickSearchInput;
