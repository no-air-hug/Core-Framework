import React, { useEffect, useRef, useState } from "react";

import IconMinus from "../../svgs/icon-minus.svg";
import IconPlus from "../../svgs/icon-plus.svg";

interface Props {
  title: string;
  isRangeFilter: boolean; // Range filters have a fixed height because the re-render with the MUI Slider causes havoc without an explicit height declaration.
  content: React.ReactNode;
  className?: string;
  isOpen: boolean;
  toggle: () => void;
  openAccordionKey?: string;
}

const Accordion: React.FC<Props> = ({
  title,
  isRangeFilter,
  content,
  className,
  isOpen,
  toggle,
  openAccordionKey,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const decideHeight = () => {
    if (isOpen) {
      return isRangeFilter ? 94 : contentRef.current?.scrollHeight ?? 0;
    }

    return 0;
  };

  const [maxHeight, setMaxHeight] = useState<number>(decideHeight());

  /* Updates the max-height of the accordion if content of isOpen changes. */
  useEffect(() => {
    setMaxHeight(decideHeight());
  }, [isOpen]);

  /**
   * Annoyingly, Klevu's FilterManager will remove filters that return no results, and there's no way to change this functionality
   * so they always persist. This means that on update, the accordion positions change, causing the accordion to reopen and subsequently
   * re-animate. This useEffect prevents that from happening, and ensures they only animate when the actual openAccordionKey is altered.
   * This is functionality is only for use on any page that utilises the Klevu filters.
   */
  useEffect(() => {
    if (contentRef.current)
      contentRef.current.style.transition = "max-height 300ms ease-in-out";
    setTimeout(() => {
      if (contentRef.current) contentRef.current.style.transition = "";
    }, 300);
  }, [openAccordionKey]);

  return (
    <li className={className}>
      <button
        onClick={toggle}
        className="flex w-full cursor-pointer select-none items-center justify-between gap-x-3 bg-transparent px-0 py-[2.3rem] text-left text-[1.3rem] font-bold leading-1 tracking-1 text-black 4xl:text-base"
      >
        <span className="overflow-hidden text-ellipsis">{title}</span>

        {isOpen ? (
          <IconMinus className="w-2 h-2 min-h-2 min-w-2 fill-black" />
        ) : (
          <IconPlus className="w-2 h-2 min-h-2 min-w-2 fill-black" />
        )}
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
        }}
      >
        {content}
      </div>
    </li>
  );
};

export default Accordion;
