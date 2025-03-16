import React from "react";
import he from "he";

type Props = {
  visible: boolean;
  onClick: () => void;
};

const Pagination: React.FC<Props> = ({ visible, onClick }) => {
  const handleClickEvent = () => {
    onClick();
  };

  const buttonClasses = "o-button o-button--primary max-w-[32.8rem]";

  return (
    <div className="flex items-center justify-center pt-14">
      {visible ? (
        <button
          className={buttonClasses}
          type="button"
          onClick={handleClickEvent}
        >
          {he.decode(Klevu.i18n.pagination.load_more)}
        </button>
      ) : (
        <button
          className={`${buttonClasses} opacity-50`}
          type="button"
          disabled
        >
          {he.decode(Klevu.i18n.pagination.loaded)}
        </button>
      )}
    </div>
  );
};

export default Pagination;
