import React from "react";
import type { KlevuRecord } from "@klevu/core";

import { useGlobalVariables } from "../../global-variables-context";

type ScoreCardProps = {
  tooltip?: boolean;
  label: string;
  value: string | number | JSX.Element;
};

const ScoreCard: React.FC<ScoreCardProps> = ({ tooltip, label, value }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
      }}
    >
      <caption
        style={{
          padding: "3px 0 0 0",
          fontWeight: "bold",
          color: tooltip ? "white" : "#2b556e",
          textAlign: tooltip ? "start" : "end",
          flex: 1,
          maxWidth: tooltip ? "30%" : "100%",
        }}
      >
        {label}:
      </caption>
      <caption
        style={{
          padding: "3px 0 0 0",
          textAlign: "start",
          flex: 1,
        }}
      >
        {value}
      </caption>
    </div>
  );
};

type DebugProps = {
  product: KlevuRecord;
};

const ProductCardDebug: React.FC<DebugProps> = ({ product }) => {
  const { debugMode, designMode } = useGlobalVariables();

  const klevu_product_boosting = product.klevu_product_boosting as number;
  const klevu_applied_filter_boosts =
    product.klevu_applied_filter_boosts as string;
  const klevu_applied_keyword_boosts =
    product.klevu_applied_keyword_boosts as string;

  if (designMode && debugMode) {
    return (
      <div>
        {product.score && (
          <ScoreCard
            label="Score"
            value={product.score ? (+product.score).toFixed(5) : product.score}
          />
        )}
        {product.klevu_product_boosting && (
          <ScoreCard
            label="Product Boosting"
            value={
              klevu_product_boosting
                ? (+klevu_product_boosting).toFixed(5)
                : klevu_product_boosting
            }
          />
        )}
        {product.klevu_bulk_boosting && (
          <ScoreCard
            label="Rule-Based"
            value={
              product.klevu_bulk_boosting
                ? (+product.klevu_bulk_boosting).toFixed(5)
                : product.klevu_bulk_boosting
            }
          />
        )}
        {product.klevu_selflearning_boosting && (
          <ScoreCard
            label="SelfLearning"
            value={
              product.klevu_selflearning_boosting
                ? (+product.klevu_selflearning_boosting).toFixed(5)
                : product.klevu_selflearning_boosting
            }
          />
        )}
        {product.klevu_manual_boosting && (
          <ScoreCard
            label="Manual"
            value={
              product.klevu_manual_boosting
                ? (+product.klevu_manual_boosting).toFixed(5)
                : product.klevu_manual_boosting
            }
          />
        )}
        {klevu_applied_filter_boosts && (
          <ScoreCard
            label="Filter Boosts"
            value={
              <ul style={{ padding: 0 }}>
                {klevu_applied_filter_boosts
                  .split(";;")
                  .filter(Boolean)
                  .map((s) => {
                    const [one, two] = s.split("^");
                    return (
                      <li style={{ padding: 0 }}>
                        {one}(<span style={{ fontWeight: "bold" }}>{two}</span>)
                      </li>
                    );
                  })}
              </ul>
            }
            tooltip
          />
        )}
        {klevu_applied_keyword_boosts && (
          <ScoreCard
            label="Keyword Boosts"
            value={
              <ul style={{ padding: 0 }}>
                {klevu_applied_keyword_boosts
                  .split(";;")
                  .filter(Boolean)
                  .map((s) => {
                    const [one, two] = s.split("^");
                    return (
                      <li style={{ padding: 0 }}>
                        {one}(<span style={{ fontWeight: "bold" }}>{two}</span>)
                      </li>
                    );
                  })}
              </ul>
            }
            tooltip
          />
        )}
      </div>
    );
  }

  return false;
};

export default ProductCardDebug;
