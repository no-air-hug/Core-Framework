import React from "react";

import { useGlobalVariables } from "../../global-variables-context";
import LogoDesktop from "../../svgs/logo-desktop.svg";
import LogoMobile from "../../svgs/logo-mobile.svg";

const Logo: React.FC = () => {
  const { currentViewport, mobileViewports, desktopViewports } =
    useGlobalVariables();

  const classes = "w-full h-full";

  return (
    <div className="w-full lg:max-w-[11rem] 4xl:max-w-[13.2rem]">
      {mobileViewports.includes(currentViewport) && (
        <LogoMobile className={classes} />
      )}
      {desktopViewports.includes(currentViewport) && (
        <LogoDesktop className={classes} />
      )}
    </div>
  );
};

export default Logo;
