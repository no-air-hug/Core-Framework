import React, { useState } from "react";
import he from "he";
import { useLocation, useNavigate } from "react-router-dom";

import useQuery from "../../hooks/use-query";

const SearchInput: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [searchValue, setSearchValue] = useState(
    String(new URLSearchParams(search).get("q")),
  );

  const onSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchValue(event.target.value);
  };

  const onKeydown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter") {
      query.set("q", searchValue);
      navigate(`/search?${query.toString()}`);
    }
  };

  return (
    <div className="pb-[4rem]">
      <p className="leading-2 text-xs font-medium text-black lg:text-[1.3rem]">
        {he.decode(Klevu.i18n.search_landing.input.heading)}
      </p>
      <div className="pt-[5.2rem]">
        <input
          type="text"
          name="klevu-main-search-input"
          id="search"
          className="border-grey-120 w-full border-b border-solid border-border-light pb-2 text-[2.3rem] font-bold leading-[4rem] text-black lg:text-[3.3rem]"
          placeholder={he.decode(Klevu.i18n.search_landing.input.placeholder)}
          value={searchValue}
          autoComplete="off"
          aria-label={he.decode(Klevu.i18n.search_landing.input.accessibility)}
          onChange={onSearchChange}
          onKeyDown={onKeydown}
        />
      </div>
    </div>
  );
};

export default SearchInput;
