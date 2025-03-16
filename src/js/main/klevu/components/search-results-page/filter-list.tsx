import React, { useCallback, useEffect, useRef, useState } from "react";
import { FilterManager, type FilterManagerFilters } from "@klevu/core";
import * as Slider from "@radix-ui/react-slider";
import he from "he";

import { debounce } from "../../../../utils";
import { formatMoney } from "../../../../utils/shopify";
import IconCheckmark from "../../svgs/icon-checkmark.svg";
import Accordion from "../general/accordion";

type Props = {
  filterManager: FilterManager;
};

const FilterList: React.FC<Props> = ({ filterManager }) => {
  const [openAccordionKey, setOpenAccordionKey] = useState<string>("");

  const filterManagerRef = useRef(filterManager);
  useEffect(() => {
    filterManagerRef.current = filterManager;
  }, [filterManager]);

  const debouncedSlider = useCallback(
    debounce((key: string, value: number[]) => {
      if (value[0] !== undefined && value[1] !== undefined) {
        filterManagerRef.current.updateSlide(key, value[0], value[1]);
      }
    }, 20),
    [],
  );

  const handleSliderChange = useCallback(
    (value: number[], key: string) => {
      debouncedSlider(key, value);
    },
    [debouncedSlider],
  );

  const handleAccordionToggle = (filter: FilterManagerFilters) => {
    const accordionThatUserInteractedWith = filter.key;

    // If the current open accordion is the same as the accordion the user just clicked, set no open accordion.
    if (openAccordionKey === accordionThatUserInteractedWith) {
      setOpenAccordionKey("");
    } else {
      setOpenAccordionKey(accordionThatUserInteractedWith);
    }
  };

  return (
    <ul className="flex flex-col">
      {filterManager.filters.map((filter, index) => {
        const isRangeFilter = !FilterManager.isKlevuFilterResultOptions(filter);

        let title = filter.label === "klevu_price" ? "Price" : filter.label;
        let totalSelectedFilters = 0;

        if (isRangeFilter) {
          const absoluteMin = Number.parseInt(filter.min);
          const absoluteMax = Number.parseInt(filter.max);

          const currentMinValue = Number.parseInt(filter.start ?? filter.min);
          const currentMaxValue = Number.parseInt(filter.end ?? filter.max);

          // If there's no difference between min/max (i.e. we only return one £70 product), don't show this filter
          if (filter.min === filter.max) return;

          if (
            currentMinValue != absoluteMin ||
            currentMaxValue != absoluteMax
          ) {
            totalSelectedFilters = 1;
          }
        } else {
          filter.options.map((f) => f.selected && totalSelectedFilters++);
        }

        if (totalSelectedFilters > 0)
          title = `${title} (${totalSelectedFilters})`;

        return (
          <React.Fragment key={index}>
            <Accordion
              isRangeFilter={isRangeFilter}
              isOpen={filter.key === openAccordionKey}
              toggle={() => {
                handleAccordionToggle(filter);
              }}
              title={title}
              className={filter.label === "klevu_price" ? "order-0" : "order-1"}
              openAccordionKey={openAccordionKey}
              content={
                isRangeFilter ? (
                  <div>
                    <div>
                      <Slider.Root
                        className="relative flex min-h-[24px] items-center"
                        onValueChange={(value) => {
                          handleSliderChange(value, filter.key);
                        }}
                        value={[
                          Number.parseInt(filter.start || filter.min),
                          Number.parseInt(filter.end || filter.max),
                        ]}
                        max={Number.parseInt(filter.max)}
                        min={Number.parseInt(filter.min)}
                        step={1}
                      >
                        <Slider.Track className="relative h-[4px] flex-grow cursor-pointer overflow-hidden rounded-full bg-grey-60">
                          <Slider.Range className="absolute h-full bg-highlight" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-white border-4 border-solid rounded-full cursor-pointer border-highlight" />
                        <Slider.Thumb className="block w-5 h-5 bg-white border-4 border-solid rounded-full cursor-pointer border-highlight" />
                      </Slider.Root>
                    </div>

                    <small className="py-4 text-xs">
                      {he.decode(
                        Klevu.i18n.search_landing.facets.filters.list.price.range
                          .replace(
                            "{{ price_min }}",
                            formatMoney({
                              cents:
                                Number.parseInt(filter.start || filter.min) *
                                100,
                            }),
                          )
                          .replace(
                            "{{ price_max }}",
                            formatMoney({
                              cents:
                                Number.parseInt(filter.end || filter.max) * 100,
                            }),
                          ),
                      )}
                    </small>
                  </div>
                ) : (
                  <ul
                    className="flex flex-col h-full overflow-hidden transition-all gap-y-4"
                    key={index}
                  >
                    {filter.options.map((o2, i2) => (
                      <li
                        key={i2}
                        role={"filter"}
                        className="flex items-center cursor-pointer group gap-x-3"
                        onClick={() => {
                          filterManager.toggleOption(filter.key, o2.name);
                        }}
                      >
                        <div className="flex items-center justify-center transition-colors border border-solid appearance-none cursor-pointer min-h-4 min-w-4 border-border-light group-hover:border-black">
                          {o2.selected && (
                            <IconCheckmark className="h-rem w-rem" />
                          )}
                        </div>

                        <button
                          type="button"
                          title={o2.name}
                          className="cursor-pointer select-none overflow-hidden text-ellipsis bg-transparent !p-0 text-[1.3rem] text-black 4xl:text-md"
                        >
                          {o2.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              }
            />
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default FilterList;
