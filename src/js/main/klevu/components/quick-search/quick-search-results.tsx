import React, { useEffect, useRef } from "react";
import type {
  KlevuRecord,
  KlevuResponseQueryObject,
  KlevuSuggestionResult,
} from "@klevu/core";
import he from "he";

import { lock, release } from "../../../../utils";
import { useGlobalVariables } from "../../global-variables-context";
import ProductCardSimple from "../product-card/product-card-simple";

const stripHtmlTags = (input: string): string => {
  return input.replaceAll(/<\/?[^>]+(>|$)/g, "");
};

type Props = {
  response: KlevuResponseQueryObject | undefined;
  responseTrending: KlevuResponseQueryObject | undefined;
  responseSuggestions: KlevuSuggestionResult | undefined;
  responseSuggestionInteraction: () => void;
  inputEl: HTMLInputElement | null;
  isOpen: boolean;
};

const QuickSearchResults: React.FC<Props> = ({
  response,
  responseTrending,
  responseSuggestions,
  responseSuggestionInteraction,
  inputEl,
  isOpen,
}) => {
  const handleSuggestionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!inputEl) return;

    const target = event.target as HTMLInputElement;
    const newQuery = target.textContent ?? "";
    inputEl.value = newQuery;

    responseSuggestionInteraction();
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    // Settings
    klevuKMCSettings,
    // Viewport
    currentViewport,
    mobileViewports,
  } = useGlobalVariables();

  const isMobile = mobileViewports.includes(currentViewport);
  const userHasInputText = isOpen && inputEl && inputEl.value.length > 0;

  // Prepare Suggestions, remove instance of currently searched query from showing up inside of suggestions
  const querySuggestions = responseSuggestions?.suggestions.filter(
    (v) => stripHtmlTags(v.suggest) != inputEl?.value.toLowerCase(),
  );
  querySuggestions?.slice(0, isMobile ? 5 : 7);

  // Prepare Popular Terms
  const popularSuggestions = klevuKMCSettings?.root?.klevu_webstorePopularTerms;
  popularSuggestions?.slice(0, isMobile ? 5 : 7);

  // Suggestion and Popular Terms Styling
  const suggestionGeneralClasses =
    "p-0 select-none cursor-pointer text-black lowercase tracking-1 transition-opacity hover:opacity-50";
  const suggestionLinkClasses =
    "lg:p-0 lg:text-left lg:text-base lg:underline lg:underline-offset-1 lg:font-medium hover:lg:no-underline";
  const suggestionButtonClasses =
    "max-lg:p-[1.3rem] max-lg:text-[1.3rem] max-lg:font-bold max-lg:border-2 max-lg:border-solid max-lg:border-black max-lg:rounded-[0.5rem]";

  useEffect(() => {
    if (isOpen && resultsRef.current) {
      void lock(resultsRef.current);
    } else if (resultsRef.current) {
      void release(resultsRef.current);
    }
  }, [isOpen]);

  const querySuggestionsComponent = () => {
    return (
      // The user has input text, show suggestions based off of their query...
      querySuggestions?.length && querySuggestions.length > 0 ? (
        querySuggestions.map((querySuggestion, index: number) => (
          <li key={index}>
            <button
              type="button"
              className={`${suggestionGeneralClasses} ${suggestionLinkClasses} ${suggestionButtonClasses}`}
              onClick={handleSuggestionClick}
            >
              {stripHtmlTags(querySuggestion.suggest)}
            </button>
          </li>
        ))
      ) : (
        <p className="col-span-4 text-sm">
          {he.decode(Klevu.i18n.quick_search.results.suggestions.no_results)}
        </p>
      )
    );
  };

  const popularSuggestionsComponent = () => {
    return popularSuggestions?.length && popularSuggestions.length > 0 ? (
      popularSuggestions.map((popularSuggestion: string, index: number) => {
        return (
          <li key={index}>
            <button
              type="button"
              className={`${suggestionGeneralClasses} ${suggestionLinkClasses} ${suggestionButtonClasses}`}
              onClick={handleSuggestionClick}
            >
              {popularSuggestion}
            </button>
          </li>
        );
      })
    ) : (
      <p className="col-span-4 text-sm">
        {he.decode(Klevu.i18n.quick_search.results.suggestions.no_results)}
      </p>
    );
  };

  return (
    <>
      <div
        className={`border-grey-110 absolute left-0 -z-1 w-full overflow-auto border-y border-solid bg-white transition-[top] duration-500 ${isMobile ? "h-screen-d-minus-header" : "h-auto"}`}
        style={{
          top: isOpen
            ? "var(--header-group-height)"
            : `calc((var(--header-group-height) + ${
                isMobile ? "100dvh" : "50dvh"
              }) * -1)`,
        }}
        ref={resultsRef}
      >
        <div className="h-full text-black animate-fade-in px-row max-lg:overflow-scroll">
          <div className="flex h-full max-lg:flex-col">
            {/* Suggestions */}
            <div
              className={
                "border-grey-110 w-full border-solid pb-[2.6rem] pt-6 max-lg:border-b lg:mr-[4rem] lg:w-[18.63%] lg:border-r lg:py-[5rem] lg:pr-[4rem]"
              }
            >
              <div className="mx-6 md:mx-[6rem] lg:mx-0">
                <h6 className="tracking-3 select-none pb-[2.2rem] text-[1.3rem] font-bold uppercase lg:pb-[4rem]">
                  {userHasInputText
                    ? he.decode(
                        Klevu.i18n.quick_search.results.suggestions
                          .query_suggestions.title,
                      )
                    : he.decode(
                        Klevu.i18n.quick_search.results.suggestions
                          .popular_suggestions.title,
                      )}
                </h6>
                <ul className="flex max-lg:flex-wrap max-lg:gap-x-rem max-lg:gap-y-3 lg:flex-col lg:gap-y-5">
                  {userHasInputText
                    ? querySuggestionsComponent()
                    : popularSuggestionsComponent()}
                </ul>
              </div>
            </div>

            {/* Products */}
            <div className="flex w-full py-9 lg:w-[81.37%] lg:py-10">
              <div className="w-full">
                <div className="flex w-full items-start justify-between pb-[2.2rem] lg:pb-[4rem]">
                  <h6 className="tracking-3 select-none text-[1.3rem] font-bold uppercase">
                    {userHasInputText
                      ? he.decode(
                          Klevu.i18n.quick_search.results.products
                            .query_products.title,
                        )
                      : he.decode(
                          Klevu.i18n.quick_search.results.products
                            .trending_products.title,
                        )}
                  </h6>

                  {userHasInputText && (
                    <a
                      className="text-base font-medium text-right text-black underline transition-opacity select-none tracking-1 hover:no-underline hover:opacity-50"
                      href={`search?q=${response?.query.meta.searchedTerm}`}
                    >
                      {he.decode(
                        Klevu.i18n.quick_search.results.view_all_results,
                      )}
                    </a>
                  )}
                </div>

                <ul className="grid grid-cols-2 gap-x-[1.5rem] gap-y-[4rem] md:gap-x-[4rem] md:gap-y-5 lg:grid-cols-5">
                  {userHasInputText ? (
                    // The user has input text, show the results of their query...
                    response?.query.records.length &&
                    response.query.records.length > 0 ? (
                      response.query.records.map((result: KlevuRecord) => {
                        return (
                          <li key={result.id}>
                            <ProductCardSimple product={result} />
                          </li>
                        );
                      })
                    ) : (
                      <p className="col-span-4 text-[12px]">
                        {he.decode(
                          Klevu.i18n.quick_search.results.products.no_results,
                        )}
                      </p>
                    )
                  ) : (
                    // The user has NOT input text, show the trending products!
                    responseTrending?.records.map((result: KlevuRecord) => {
                      return (
                        <li key={result.id}>
                          <ProductCardSimple product={result} />
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute left-0 w-full transition-opacity duration-500 delay-500 top-header-group -z-2 h-screen-d-minus-header bg-overlay"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />
    </>
  );
};

export default QuickSearchResults;
