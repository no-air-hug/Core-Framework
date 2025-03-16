import React from "react";

type Props = {
  className?: string;
  size?: number;
};

const LoadingIndicator: React.FC<Props> = ({ className, size }) => {
  const sizeString = `${size}px`;
  return (
    <div
      className={`loading-overlay flex animate-fade-in items-center justify-center ${className ?? ""}`}
      style={{
        width: sizeString,
      }}
    >
      <div
        className="loading-overlay__spinner"
        style={{
          width: sizeString,
        }}
      >
        <svg
          className="spinner"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
          stroke="inherit"
          width={size}
          height={size}
        >
          <circle
            className="path"
            fill="none"
            strokeWidth="6"
            cx="33"
            cy="33"
            r="30"
          ></circle>
        </svg>
      </div>
    </div>
  );
};

export default LoadingIndicator;
