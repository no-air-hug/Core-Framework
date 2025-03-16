export default async function dialogController() {
  import("./dialog.scss");
  const results = Promise.allSettled([
    import("./drawer-account"),
    import("./drawer-cart"),
    import("./drawer-facets"),
    import("./drawer-navigation"),
    import("./drawer-pickup"),
  ]);
  const { Dialog } = await import("./dialog");
  for (const result of await results) {
    if (result.status === "fulfilled") {
      void result.value.register(Dialog);
    }
  }
}
