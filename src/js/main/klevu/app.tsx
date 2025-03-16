import React from "react";

import GlobalVariablesContextProvider from "./global-variables-context";

interface AppProps {
  children?: React.ReactNode; // Allow App to accept children
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <GlobalVariablesContextProvider>{children}</GlobalVariablesContextProvider>
  );
};

export default App;
