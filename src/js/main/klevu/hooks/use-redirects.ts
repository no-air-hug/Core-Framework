import { type KlevuResponseQueryObject } from "@klevu/core";

/**
 * Utilises redirects set inside of the merchant center by ingesting a response query object,
 * and redirecting the user to the assigned url for a redirect.
 *
 * @param results
 */
const useRedirects = async (results: KlevuResponseQueryObject) => {
  if (results.getRedirects) {
    const redirects = await results.getRedirects();

    if (redirects.length > 0) {
      const redirect = redirects[0];
      if (redirect) window.location.href = redirect.url;
    }
  }
};

export default useRedirects;
