// FORMAT MONEY
export function formatMoney({ cents }: { cents: number }): string {
  return new Intl.NumberFormat(
    `${window.Shopify.locale}-${window.Shopify.country}`,
    {
      style: "currency",
      currency: window.Shopify.currency.active,
    },
  ).format(cents / 100);
}
