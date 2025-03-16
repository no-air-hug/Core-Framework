export const webView = {
  dispatchEvent(detail: { event: string; value: unknown }) {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.webViewBridge
    ) {
      window.webkit.messageHandlers.webViewBridge.postMessage(
        JSON.stringify(detail),
      );
    } else if (window.webViewBridge !== undefined) {
      window.webViewBridge.postMessage(JSON.stringify(detail));
    }
  },
} as const;
