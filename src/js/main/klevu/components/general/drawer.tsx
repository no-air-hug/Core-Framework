import React, { useCallback, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { useGlobalVariables } from "../../global-variables-context";
import IconClose from "../../svgs/icon-close.svg";

type Props = {
  title: string;
  accessibilityTitle: string;
  accessibilityDescription: string;
  main: React.ReactNode;
  footer?: React.ReactNode;
};

const Drawer: React.FC<Props> = ({
  title,
  accessibilityTitle,
  accessibilityDescription,
  main,
  footer,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const { filterDisplayState, toggleFilterDisplayState } = useGlobalVariables();

  const handleDialogClose = useCallback(
    (close: boolean) => {
      if (close && dialogRef.current) {
        dialogRef.current.classList.add("is-hiding");

        setTimeout(() => {
          toggleFilterDisplayState(false);
        }, 300);
      }
    },
    [toggleFilterDisplayState],
  );

  const setHeaderHeight = useCallback(() => {
    dialogRef.current?.style.setProperty(
      "--dialog-drawer-header-height",
      `${headerRef.current?.clientHeight ?? 0}px`,
    );
  }, []);

  const setFooterHeight = useCallback(() => {
    dialogRef.current?.style.setProperty(
      "--dialog-drawer-footer-height",
      `${footerRef.current?.clientHeight ?? 0}px`,
    );
  }, []);

  const initResizeObservers = () => {
    if (headerRef.current) {
      const headerResizeObserver = new ResizeObserver(setHeaderHeight);
      headerResizeObserver.observe(headerRef.current);
    }

    if (footerRef.current) {
      const footerResizeObserver = new ResizeObserver(setFooterHeight);
      footerResizeObserver.observe(footerRef.current);
    }

    setHeaderHeight();
    setFooterHeight();
  };

  return (
    <Dialog.Root open={filterDisplayState}>
      <Dialog.Portal>
        <Dialog.Content
          onOpenAutoFocus={initResizeObservers}
          className="dialog dialog--drawer dialog--drawer-left"
          ref={dialogRef}
          aria-hidden={!filterDisplayState}
          aria-modal="false"
          role="dialog"
        >
          <Dialog.Overlay
            className="dialog-overlay"
            onClick={() => {
              handleDialogClose(true);
            }}
          />

          <div role="document">
            <header ref={headerRef} data-dialog-element="header">
              <div className="flex items-center justify-between gap-x-3">
                <Dialog.Title className="font-bold font-heading">
                  {title}
                </Dialog.Title>

                <button
                  onClick={() => {
                    handleDialogClose(true);
                  }}
                  aria-label={window.Shopify.theme.i18n.global.dialogs.accessibility.actions.close.replace(
                    "{{ dialog }}",
                    accessibilityTitle,
                  )}
                  className="w-6 stroke-2 aspect-square stroke-black"
                >
                  <IconClose />
                </button>
              </div>
            </header>

            <div ref={mainRef} data-dialog-element="main">
              <VisuallyHidden.Root>
                <Dialog.Description>
                  {accessibilityDescription}
                </Dialog.Description>
              </VisuallyHidden.Root>

              {main}
            </div>
          </div>

          {footer && (
            <footer ref={footerRef} data-dialog-element="footer">
              {footer}
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Drawer;
