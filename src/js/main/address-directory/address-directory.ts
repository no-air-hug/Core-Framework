import { postcodeValidator } from "postcode-validator";

import { get, getAll } from "../../utils";

interface NativeName {
  official: string;
  common: string;
}

interface Name {
  common: string;
  official: string;
  nativeName: {
    eng: NativeName;
    fra: NativeName;
    nrf: NativeName;
  };
}

interface Currency {
  name: string;
  symbol: string;
}

interface Currencies {
  GBP: Currency;
  JEP: Currency;
}

interface Idd {
  root: string;
  suffixes: string[];
}

interface Translations {
  ara: NativeName;
  bre: NativeName;
  ces: NativeName;
  cym: NativeName;
  deu: NativeName;
  est: NativeName;
  fin: NativeName;
  fra: NativeName;
  hrv: NativeName;
  hun: NativeName;
  ita: NativeName;
  jpn: NativeName;
  kor: NativeName;
  nld: NativeName;
  per: NativeName;
  pol: NativeName;
  por: NativeName;
  rus: NativeName;
  slk: NativeName;
  spa: NativeName;
  srp: NativeName;
  swe: NativeName;
  tur: NativeName;
  urd: NativeName;
  zho: NativeName;
}

interface Demonyms {
  eng: { f: string; m: string };
  fra: { f: string; m: string };
}

interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

interface Car {
  signs: string[];
  side: string;
}

interface Flags {
  png: string;
  svg: string;
}

interface CoatOfArms {
  png: string;
  svg: string;
}

interface CapitalInfo {
  latlng: number[];
}

interface PostalCode {
  format: string;
  regex: string;
}

type RestCountriesCountry = {
  name: Name;
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: Currencies;
  idd: Idd;
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: {
    eng: string;
    fra: string;
    nrf: string;
  };
  translations: Translations;
  latlng: number[];
  landlocked: boolean;
  area: number;
  demonyms: Demonyms;
  flag: string;
  maps: Maps;
  population: number;
  car: Car;
  timezones: string[];
  continents: string[];
  flags: Flags;
  coatOfArms: CoatOfArms;
  startOfWeek: string;
  capitalInfo: CapitalInfo;
  postalCode: PostalCode;
};

class AddressDirectory extends HTMLElement {
  element: HTMLElement;

  addressDirectoryMain: HTMLElement;
  addressDirectoryNew: HTMLElement;

  addresses: HTMLLIElement[];
  addressEditButtons: HTMLButtonElement[];
  addressAddButton: HTMLElement;
  addressRemoveForms: HTMLFormElement[];

  constructor() {
    super();
    this.element = this;

    this.addressDirectoryMain = get(
      ".js-address-directory-main",
      this.element,
    ) as HTMLElement;
    this.addressDirectoryNew = get(
      ".js-address-directory-new",
      this.element,
    ) as HTMLElement;

    this.addresses = getAll(".js-address", this.element) as HTMLLIElement[];
    this.addressEditButtons = getAll(
      ".js-address-edit-button",
      this.element,
    ) as HTMLButtonElement[];
    this.addressAddButton = get(
      ".js-add-address-button",
      this.element,
    ) as HTMLButtonElement;
    this.addressRemoveForms = getAll(
      ".js-address-remove-form",
      this.element,
    ) as HTMLFormElement[];

    this.bindEvents();
  }

  bindEvents() {
    this.handleAddFormReveal();

    if (this.addressEditButtons.length > 0) {
      this.handleEditFormReveal();
      this.handleRemoveForms();
    }
  }

  /**
   * Returns the height of a element as a style
   * declaration in the form of maxHeight, useful for
   * when an element his hidden by max-height and you
   * need to reveal it.
   *
   * @param element
   */
  setElementMaxHeight(element: HTMLElement) {
    const prevMaxHeight = element.style.maxHeight; // Save the current max-height property

    // Temporarily remove the max-height property
    element.style.maxHeight = "none";

    const computedHeight = window.getComputedStyle(element).height; // Get the computed height

    // Restore the previous max-height property
    element.style.maxHeight = prevMaxHeight;

    // Timeout allows time for transitions
    setTimeout(() => {
      const height = Number.parseFloat(computedHeight); // Parse the height value to a number

      element.style.maxHeight = `${height}px`;
    }, 100);
  }

  handleEditFormReveal() {
    for (const editButton of this.addressEditButtons) {
      const addressEl = editButton.closest(".js-address") as
        | HTMLElement
        | undefined;
      if (!addressEl) continue;

      const wrapper = get(".js-address-edit-wrapper", addressEl) as HTMLElement;
      const tools = get(".js-address-tools", addressEl) as HTMLElement;
      const countrySelector = get(
        ".js-address-country-selector",
        addressEl,
      ) as HTMLSelectElement;
      const zipPostcodeInput = get(
        ".js-address-zip",
        addressEl,
      ) as HTMLInputElement;
      const zipPostcodeInputError = get(
        ".js-address-zip-error",
        addressEl,
      ) as HTMLSpanElement;
      const updateButton = get(
        ".js-address-new-update-button",
        addressEl,
      ) as HTMLButtonElement;
      const cancelButton = get(
        ".js-address-edit-cancel-button",
        addressEl,
      ) as HTMLElement;

      // Edit Button Handling
      editButton.addEventListener("click", () => {
        // Prevent multiple address modules from being open at once.
        for (let i = 0; i < this.addressEditButtons.length; i++) {
          const otherEditButton = this.addressEditButtons[i];
          if (!otherEditButton || editButton === otherEditButton) continue;

          const addressEl = otherEditButton.closest(
            ".js-address",
          ) as HTMLElement;
          const wrapper = get(
            ".js-address-edit-wrapper",
            addressEl,
          ) as HTMLElement;
          const tools = get(".js-address-tools", addressEl) as HTMLElement;

          wrapper.style.maxHeight = "0px";
          tools.classList.remove("h-0", "-mt-3");
        }

        // Open currently targeted address module
        this.setElementMaxHeight(wrapper);
        tools.classList.add("h-0", "-mt-3");
      });

      // Country Select Handling - On Load
      this.determineProvinces(countrySelector);

      // Country Select Handling - Default Value Application
      if (
        countrySelector.dataset.default &&
        countrySelector.dataset.default.length > 0
      ) {
        countrySelector.value = countrySelector.dataset.default;
        this.determineProvinces(countrySelector);

        const provinceSelector = get(
          ".js-address-province-selector",
          addressEl,
        ) as HTMLSelectElement;

        if (
          provinceSelector.dataset.default &&
          provinceSelector.dataset.default.length > 0
        ) {
          provinceSelector.value = provinceSelector.dataset.default;
        }
      }

      // Country Select Handling - Change Event
      countrySelector.addEventListener("change", () => {
        this.determineProvinces(countrySelector);
        this.setElementMaxHeight(wrapper);

        // Reset Postcode to re-validate it.
        zipPostcodeInput.value = "";
        updateButton.disabled = true;
        zipPostcodeInputError.classList.add("hidden");
      });

      // Postcode Validation
      this.validatePostcode(
        countrySelector,
        zipPostcodeInput,
        zipPostcodeInputError,
        updateButton,
      );

      zipPostcodeInput.addEventListener("input", () => {
        this.validatePostcode(
          countrySelector,
          zipPostcodeInput,
          zipPostcodeInputError,
          updateButton,
        );
      });

      // Cancel Button Handling
      cancelButton.addEventListener("click", () => {
        wrapper.style.maxHeight = "0px";
        tools.classList.remove("h-0", "-mt-3");
      });
    }
  }

  handleAddFormReveal() {
    const form = get(".js-address-form-new") as HTMLElement;
    const countrySelector = get(
      ".js-address-country-selector",
      form,
    ) as HTMLSelectElement;
    const zipPostcodeInput = get(".js-address-zip", form) as HTMLInputElement;
    const zipPostcodeInputError = get(
      ".js-address-zip-error",
      form,
    ) as HTMLSpanElement;
    const addButton = get(
      ".js-address-new-add-button",
      form,
    ) as HTMLButtonElement;
    const cancelButton = get(
      ".js-address-new-cancel-button",
      form,
    ) as HTMLButtonElement;

    // Add Address Handling
    this.addressAddButton.addEventListener("click", () => {
      this.addressDirectoryMain.classList.add("hidden");
      this.addressDirectoryNew.classList.remove("hidden");
    });

    // Country Select Handling - On Load
    this.determineProvinces(countrySelector);

    // Country Select Handling - Change Event
    countrySelector.addEventListener("change", () => {
      this.determineProvinces(countrySelector);

      // Reset Postcode to re-validate it.
      zipPostcodeInput.value = "";
      addButton.disabled = true;
      zipPostcodeInputError.classList.add("hidden");
    });

    // Postcode Validation
    zipPostcodeInput.addEventListener("input", () => {
      this.validatePostcode(
        countrySelector,
        zipPostcodeInput,
        zipPostcodeInputError,
        addButton,
      );
    });

    // Cancel Button Handling
    cancelButton.addEventListener("click", () => {
      this.addressDirectoryMain.classList.remove("hidden");
      this.addressDirectoryNew.classList.add("hidden");
    });
  }

  validatePostcode(
    countrySelector: HTMLSelectElement,
    zipPostcodeInput: HTMLInputElement,
    zipPostcodeInputError: HTMLSpanElement,
    submitButton: HTMLButtonElement,
  ) {
    const country = countrySelector.value;
    const zip = zipPostcodeInput.value;

    // If the country selector is set to the initial settings, don't run.
    const selectedCountryValue =
      countrySelector.options[countrySelector.selectedIndex]?.value;
    if (selectedCountryValue === countrySelector.dataset.initialValue) return;

    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
      .then((res) => res.json())
      .then((data) => {
        const countries = data as RestCountriesCountry[];
        const country = countries[0];
        if (!country) return;

        const countryISO = country.cca2;

        try {
          const valid = postcodeValidator(zip, countryISO);

          if (valid) {
            zipPostcodeInputError.classList.add("hidden");
            submitButton.disabled = false;
          } else {
            zipPostcodeInputError.classList.remove("hidden");
            submitButton.disabled = true;
          }
        } catch {
          // INTL represents a variety of other country codes.
          const reValidated = postcodeValidator(zip, "INTL");

          if (reValidated) {
            zipPostcodeInputError.classList.add("hidden");
            submitButton.disabled = false;
          } else {
            zipPostcodeInputError.classList.remove("hidden");
            submitButton.disabled = true;
          }
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }

  determineProvinces(countrySelector: HTMLSelectElement) {
    const form = countrySelector.closest("form") as HTMLFormElement;
    const provinceWrapper = get(
      ".js-address-province-wrapper",
      form,
    ) as HTMLElement;
    const provinceSelector = get(
      ".js-address-province-selector",
      form,
    ) as HTMLSelectElement;

    const currentOption =
      countrySelector.options[countrySelector.selectedIndex];

    provinceSelector.innerHTML = "";

    if (currentOption && currentOption.dataset.provinces != "[]") {
      let currentOptionProvinces = currentOption.dataset.provinces as string;

      /**
       * Ensures England always appear first for UK customers.
       */
      if (
        currentOptionProvinces ===
        '[["British Forces","British Forces"],["England","England"],["Northern Ireland","Northern Ireland"],["Scotland","Scotland"],["Wales","Wales"]]'
      ) {
        currentOptionProvinces =
          '[["England","England"],["Northern Ireland","Northern Ireland"],["Scotland","Scotland"],["Wales","Wales"],["British Forces","British Forces"]]';
      }

      const currentOptionProvincesArray = JSON.parse(
        currentOptionProvinces,
      ) as never[];

      for (const element of currentOptionProvincesArray) {
        const option = document.createElement("option");
        option.value = element[0];
        option.innerHTML = element[1];

        provinceSelector.append(option);
      }

      provinceWrapper.classList.remove("hidden");
    } else {
      provinceWrapper.classList.add("hidden");
    }
  }

  handleRemoveForms() {
    for (const removeForm of this.addressRemoveForms) {
      removeForm.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        const confirmMessage = removeForm.dataset.confirmRemovalText;

        if (
          window.confirm(
            confirmMessage || "Are you sure you wish to remove this address?",
          )
        ) {
          removeForm.submit();
        }
      });
    }
  }
}

customElements.define("address-directory", AddressDirectory);
