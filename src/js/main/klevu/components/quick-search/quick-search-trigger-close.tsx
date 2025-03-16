import React from "react";
import he from "he";

import IconCloseBar from "../../svgs/icon-close-bar.svg";

type Props = {
  onClick: () => void;
};

const QuickSearchTriggerClose: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      type="button"
      className="-ml-[1.5rem] flex h-[4.4rem] w-[4.4rem] cursor-pointer items-center justify-center"
      aria-label={he.decode(
        Klevu.i18n.quick_search.triggers.close.accessibility,
      )}
      onClick={() => {
        onClick();
      }}
    >
      <IconCloseBar className="h-[1.4rem] w-[1.4rem] fill-black" />
      <label className="sr-only">
        {he.decode(Klevu.i18n.quick_search.triggers.close.accessibility)}
      </label>
    </button>
  );
};

export default QuickSearchTriggerClose;
