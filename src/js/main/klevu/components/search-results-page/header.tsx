import React from "react";

import SearchInput from "./search-input";
import Tabs from "./tabs";

const Header: React.FC = () => {
  return (
    <div className="flex flex-col pb-6 px-row">
      <div>
        <SearchInput />
      </div>

      <Tabs />
    </div>
  );
};

export default Header;
