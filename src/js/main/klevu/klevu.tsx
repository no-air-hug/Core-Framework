import React from "react";
import { KlevuConfig } from "@klevu/core";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { get } from "../../utils";
import App from "./app";
import QuickSearchInput from "./components/quick-search/quick-search-input";
import { config } from "./config";
import SearchResultPage from "./routes/search-result-page";

KlevuConfig.init({
  ...config,
});

// Render the quick search
const searchBar = get("#klevu-react-root-quick-search");
if (searchBar) {
  const root = createRoot(searchBar);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <App>
              <QuickSearchInput />
            </App>
          }
        ></Route>
      </Routes>
    </BrowserRouter>,
  );
}

// Render the search template
const searchTemplate = get("#klevu-react-root-search-landing");
if (searchTemplate) {
  const root = createRoot(searchTemplate);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route
          path="/search"
          element={
            <App>
              <SearchResultPage />
            </App>
          }
        ></Route>
      </Routes>
    </BrowserRouter>,
  );
}
