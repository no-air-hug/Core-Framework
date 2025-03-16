export default function lazyloadController() {
  import(/* webpackChunkName: "lazyload" */ "./lazyload");
}
