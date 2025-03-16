import React, { useContext, useEffect, useState, type ReactNode } from "react";
import {
  KlevuKMCSettings,
  KlevuSearchSorting,
  KlevuTypeOfRecord,
  type KlevuRecord,
  type KlevuResponseQueryObject,
  type KMCBannerRootObject,
  type KMCMapsRootObject,
  type KMCRootObject,
} from "@klevu/core";

import { throttle } from "../../utils";
import { config } from "./config";

type KlevuKMCSettingsType = {
  root?: KMCRootObject;
  banner?: KMCBannerRootObject;
  maps?: KMCMapsRootObject;
};

export type GlobalVariablesContextType = {
  // Settings
  klevuKMCSettings: KlevuKMCSettingsType | undefined;
  // Results & Response
  results: KlevuRecord[];
  setResults: (results: KlevuRecord[]) => void;
  response: KlevuResponseQueryObject | undefined;
  setResponse: (response: KlevuResponseQueryObject) => void;
  // Viewport
  currentViewport: Viewport;
  mobileViewports: Viewport[];
  desktopViewports: Viewport[];
  // Tabs
  currentTab:
    | KlevuTypeOfRecord.Product
    | KlevuTypeOfRecord.Cms
    | KlevuTypeOfRecord.Category
    | KlevuTypeOfRecord.Image;
  toggleTab: (
    typeOfRecord:
      | KlevuTypeOfRecord.Product
      | KlevuTypeOfRecord.Cms
      | KlevuTypeOfRecord.Category
      | KlevuTypeOfRecord.Image,
  ) => void;
  // Grid View
  currentGridColumnView: GridColumnView;
  toggleGridColumnView: (gridColumnView: GridColumnView) => void;
  // Filters
  filterDisplayState: boolean;
  toggleFilterDisplayState: (filterDisplayState: boolean) => void;
  // Sorting
  sorting: KlevuSearchSorting;
  toggleSorting: (newSortingValue: KlevuSearchSorting) => void;
  // Debugging
  debugMode: boolean;
  designMode: boolean;
  toggleDebugMode: (val: boolean) => void;
};

const GlobalVariablesContext = React.createContext<GlobalVariablesContextType>(
  {} as GlobalVariablesContextType,
);

export function useGlobalVariables() {
  return useContext(GlobalVariablesContext);
}

type GlobalVariablesContextProviderProps = {
  children: ReactNode;
};

const GlobalVariablesContextProvider: React.FC<
  GlobalVariablesContextProviderProps
> = ({ children }) => {
  // Settings
  const [klevuKMCSettings, setKlevuKMCSettings] =
    useState<KlevuKMCSettingsType>();

  useEffect(() => {
    const fetchKMCSettings = async () => {
      try {
        const kmcSettings = await KlevuKMCSettings();
        if (Object.keys(kmcSettings).length > 0)
          setKlevuKMCSettings(kmcSettings);
      } catch (error) {
        console.error("Failed to fetch KMC settings", error);
      }
    };

    void fetchKMCSettings();
  }, []);

  // Viewports
  const [currentViewport, setCurrentViewport] = useState<Viewport>("sm");

  const { viewports } = config;
  const mobileViewports = ["sm", "md"] as Viewport[];
  const desktopViewports = ["lg", "4xl"] as Viewport[];

  useEffect(() => {
    // Generate media queries for each viewport
    const mediaQueryMap: {
      query: MediaQueryList;
      viewport: keyof Viewports;
    }[] = [];

    for (const v of Object.keys(viewports) as (keyof Viewports)[]) {
      const viewport = viewports[v];
      if (typeof viewport === "string") {
        mediaQueryMap.push({
          query: window.matchMedia(`(min-width: ${String(viewport)})`),
          viewport: v,
        });
      }
    }

    const evaluateMediaQueries = throttle(() => {
      for (let i = mediaQueryMap.length - 1; i >= 0; i--) {
        const mediaQuery = mediaQueryMap[i];
        if (mediaQuery && mediaQuery.query.matches) {
          setCurrentViewport(mediaQuery.viewport);
          return;
        }
      }
      setCurrentViewport("sm");
    }, 100);

    // Initial evaluation and setup event listener
    evaluateMediaQueries();
    window.addEventListener("resize", evaluateMediaQueries);

    // Cleanup
    return () => {
      window.removeEventListener("resize", evaluateMediaQueries);
    };
  }, []);

  // Grid Column Views
  let defaultView = "large" as GridColumnView;
  const storedView = sessionStorage.getItem("klevu_grid_view");
  if (storedView && storedView.length > 0)
    defaultView = storedView as GridColumnView;

  const [currentGridColumnView, setCurrentGridColumnView] =
    useState<GridColumnView>(defaultView);

  const toggleGridColumnView = (gridColumnView: GridColumnView) => {
    setCurrentGridColumnView(gridColumnView);
    sessionStorage.setItem("klevu_grid_view", gridColumnView.toString());
  };

  // Results & Response
  const [results, setResults] = useState<KlevuRecord[]>([]);
  const [response, setResponse] = useState<KlevuResponseQueryObject>();

  // Tabs
  const [currentTab, setCurrentTab] = useState(KlevuTypeOfRecord.Product);

  const toggleTab = (
    typeOfRecord:
      | KlevuTypeOfRecord.Product
      | KlevuTypeOfRecord.Cms
      | KlevuTypeOfRecord.Category
      | KlevuTypeOfRecord.Image,
  ) => {
    setCurrentTab(typeOfRecord);
  };

  // Filters
  const [filterDisplayState, setFilterDisplayState] = useState(false);
  const toggleFilterDisplayState = (filterDisplayState: boolean) => {
    setFilterDisplayState(filterDisplayState);
  };

  // Sorting
  let sort = KlevuSearchSorting.Relevance;
  const { searchParams } = new URL(document.URL);
  const sortParam = searchParams.get("sorting");
  if (sortParam) sort = sortParam as KlevuSearchSorting;

  const [sorting, setSorting] = useState<KlevuSearchSorting>(sort);
  const toggleSorting = (newSortingValue: KlevuSearchSorting) => {
    setSorting(newSortingValue);
  };

  // Debugging
  const [debugMode, setDebugMode] = useState(
    Boolean(sessionStorage.getItem("klevu_debug_mode")) || false,
  );
  const designMode = Object.hasOwn(document.body.dataset, "isDesignMode");

  const toggleDebugMode = (val: boolean) => {
    setDebugMode(val);
    if (val) sessionStorage.setItem("klevu_debug_mode", val.toString());
    else sessionStorage.removeItem("klevu_debug_mode");
    window.location.reload();
  };

  // Adds the debug mode banner to the top of the page.
  if (designMode && debugMode) {
    useEffect(() => {
      const element = document.createElement("div");
      element.className =
        "flex items-center justify-center p-2 text-white bg-red";
      element.textContent =
        "Warning: You are currently viewing this page in debug mode!";
      document.body.insertAdjacentElement("beforebegin", element);
    }, []);
  }

  return (
    <GlobalVariablesContext.Provider
      value={{
        // Settings
        klevuKMCSettings,
        // Results & Response
        results,
        setResults,
        response,
        setResponse,
        // Viewport
        currentViewport,
        mobileViewports,
        desktopViewports,
        // Tabs
        currentTab,
        toggleTab,
        // Grid Column Views
        currentGridColumnView,
        toggleGridColumnView,
        // Filters
        filterDisplayState,
        toggleFilterDisplayState,
        // Sorting
        sorting,
        toggleSorting,
        // Debugging
        debugMode,
        designMode,
        toggleDebugMode,
      }}
    >
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export default GlobalVariablesContextProvider;
