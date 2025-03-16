import React, { type ChangeEvent } from "react";
import he from "he";

import { config } from "../../config";
import { useGlobalVariables } from "../../global-variables-context";
import IconGridView1 from "../../svgs/icon-grid-view-1.svg";
import IconGridView2 from "../../svgs/icon-grid-view-2.svg";
import IconGridView3 from "../../svgs/icon-grid-view-3.svg";

const iconClasses = (currentView: string, suppliedView: string) => {
  return `h-[1.4rem] transition-colors ${
    currentView === suppliedView
      ? "fill-black" // Active
      : "fill-grey-50 hover:fill-black" // Inactive
  }`;
};

const icons = {
  view: {
    1: (currentView: string, suppliedView: string) => {
      return (
        <IconGridView1 className={iconClasses(currentView, suppliedView)} />
      );
    },
    2: (currentView: string, suppliedView: string) => {
      return (
        <IconGridView2 className={iconClasses(currentView, suppliedView)} />
      );
    },
    3: (currentView: string, suppliedView: string) => {
      return (
        <IconGridView3 className={iconClasses(currentView, suppliedView)} />
      );
    },
  },
};

const View: React.FC = () => {
  const gridColumnViews = config.grid.columns.views;
  const {
    currentViewport,
    desktopViewports,
    currentGridColumnView,
    toggleGridColumnView,
  } = useGlobalVariables();

  const handleViewChange = (event: ChangeEvent) => {
    const newViewValue = (event.target as HTMLInputElement)
      .value as GridColumnView;
    toggleGridColumnView(newViewValue);
  };

  return (
    <div className="flex items-center gap-x-7">
      {desktopViewports.includes(currentViewport) && (
        <p className="text-base font-bold uppercase tracking-1">
          {he.decode(Klevu.i18n.view.title)}
        </p>
      )}

      {Object.keys(gridColumnViews).map(
        (gridColumnView: string, index: number) => {
          const template = gridColumnViews[gridColumnView as GridColumnView];
          const view = template[currentViewport];
          const icon = icons.view[view as 1 | 2 | 3];

          return (
            <label className="flex cursor-pointer" key={index}>
              {icon(currentGridColumnView, gridColumnView)}

              <input
                type="radio"
                id="view"
                name="view"
                value={gridColumnView}
                className="hidden"
                onChange={handleViewChange}
              />
            </label>
          );
        },
      )}
    </div>
  );
};

export default View;
