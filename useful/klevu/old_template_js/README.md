# Installation

This is setup to work with the Online Store 2.0 method of installing Klevu for (OS2 themes)[https://help.klevu.com/support/solutions/articles/5000874715-theme-modifications-for-jsv2-os2-dawn-], which is via an app embed that you need to add to the theme that you're installing Klevu on.
That block should become available once the official (Klevu app)[https://apps.shopify.com/klevu-smart-search] is installed, further to that
you also need to ensure that you install Klevu on the theme you want to test/use it on, which can be done by going to the Klevu app on the store's admin, going to 'Integrate' and clicking 'Integrate on this theme' beside the theme you want to use Klevu on. This is essential,
because this step will ensure that the relevant Klevu API key is supplied to the app embed once it's added to the theme.

To add the Klevu app embed to your chosen theme, go to the theme's customiser, click on 'App embeds' on the left-most side panel,
and check the slider next to the 'Klevu Javascript'. Inside that block, enable the relevant javascript modules (quick search, landing page,
and smart recommendations), and set the search results landing page to the pathname for your Klevu managed search results landing page.

This will add all the relevent Klevu JS files and the default Klevu settings into the document head, the default Klevu settings are:

```
let defaultKlevuSettings = {
  global: {
    apiKey: KLEVU_API_KEY
  },
  search: {
    minChars: 0,
    searchBoxSelector: "input[name=q]"
  },
  url: {
    search: KLEVU_SEARCH_ENDPOINT,
    landing: KLEVU_SEARCH TEMPLATE
  },
  powerUp: {}
};
```

# Customisation

## Files to Add

Inside shopify/snippets make a new folder called 'klevu', add these files inside that new folder:

- \_head.liquid
- \_quick-search-target.liquid (This is linked inside of \_head to indicate to Klevu where to inject the quick search template during a search)

You need to add `{%- render 'klevu_head' -%}` in your layout files (theme.liquid)
You need to add `{%- render 'klevu_quick-search-target' -%}` wherever you want the 'Quick Search' module to display. Note: this will only show depending on the amount of characters defined in your klevuSettings.search.minChars setting inside of \_head.liquid, i.e. if minChars is set to 8 characters, then the 'Quick Search' module will only load when 8 characters are present on the search bar referenced inside of klevuSettings.search.searchBoxSelector.

Further to those files, you'll see files inside the folders: quick_search_snippets and search_landing_snippets. Add all the files inside these two folders inside of your new klevu snippets folder. These files are all rendered inside of \_head.liquid.

There's also the optional_alternate_snippets folder which contains optional snippets with alternate looks for klevu templates, like a pagination snippet that functions more like an typical text pagination snippet you'd see on a results page.

--

Inside of shopify/sections && shopify/sections/schema respectively add:

- klevu-search-landing.liquid
- schema/klevu-search-landing.json

The klevu-search-result section is the target for Klevu's 'Search Landing' module.

--

Inside of shopify/templates add:

- page.klevu-search.json

Ensure the production theme on the site has a template with the same title. Then also ensure that a page exists on the store's admin with the url path referenced inside the Klevu app embed's settings.

## Custom Klevu Settings

'\_head.liquid' contains the extended Klevu settings and the renders for the custom klevu templates. Each template liquid file controls a certain scope and element inside each klevu module. Quick search templates for the quick search module are inside 'quick_search_snippets',
and Search landing templates for the search landing module are inside 'search_landing_snippets'.

These templates are then referenced like so inside of the setTemplates object inside of klevuSettings

```
{
  scope: "quick" (Module scope, can be a choice of or multiple: quick,catnav,landing),
  selector: "#custom_KLEVU_SCRIPT_TEMPLATE_ID", (KLEVU_SCRIPT_TEMPLATE_ID relates to the 'Script Template ID' of the template it's replacing )
  name: "klevuTemplateBase"
},
```

- **scope** refers to the module scope that the template is supposed to appear on, can be a choice of or multiple: quick, catnav, landing
- **selector** refers to the script tag id for the custom Klevu script, which is typically formatted like so: custom_KLEVU_SCRIPT_TEMPLATE_ID. KLEVU_SCRIPT_TEMPLATE_ID relates to the 'Script Template ID' of the template it's replacing. If you check the source code once the Klevu app embed is added on the theme, you'll see the default Klevu templates added in the source code. For these custom templates, I've kept the same KLEVU_SCRIPT_TEMPLATE_ID as the id, except added 'custom' at the beginning of it.
- **name** refers to where the template will render on the scope, what it's replacing. The original KLEVU_SCRIPT_TEMPLATE_ID will give you an idea of what name should reference by checking here: https://docs.klevu.com/template-js/reference. If you check the original templates KLEVU_SCRIPT_TEMPLATE_ID, and then find it under the relevant scope on this page, then the name should refer to the 'Render Name' beside that 'Script Template Id' column.

Currently all custom templates added inside of \_head.liquid refer back to the original default content that Klevu provides.

## Modifiers

At the end of \_head.liquid you might notice some modifiers inside of a DOMContentLoaded event. They're loaded this way because
the Klevu app embed inserts the klevu scripts just before the closing tag of the document head. Modifiers can be added to adjust
the data returned from Klevu requests. More information here: https://docs.klevu.com/template-js/modify-request
