# Website

This is the [Docusaurus](https://docusaurus.io/) project for the Sparo website.

## Development

1. Install the monorepo dependencies using [RushJS](https://rushjs.io/):

   ```shell
   rush install
   rush build
   ```

2. Launch the local development server:

   ```shell
   cd apps/website
   rushx start
   ```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Site search

Because this site is relatively small, searching is performed client-side using the [docusaurus-lunr-search](https://www.npmjs.com/package/docusaurus-lunr-search) plugin based on [Lunr.js](https://lunrjs.com/).

Notes:
- Site search is broken when using the localhost debug server (`rushx start`), but it works correctly for real deployments (`rushx deploy`)
- `@algolia/client-search` is included in **package.json** dependencies only because `@docusaurus/preset-classic` includes it as a peer dependency.


## Managing translations

Instructions for internationalization with Docusaurus: https://docusaurus.io/docs/i18n/introduction

The supported locales for this project can be found in the `"i18n"` section of
[docusaurus.config.js](./docusaurus.config.js).

> **NOTE:** Each locale is built as a distinct standalone single-page application. The localhost
> dev server builds only one locale at a time. To view multiple locales together, you must deploy
> the site.

Common commands:

- `rushx start --locale zh-cn` - launch the localhost dev server in the specified language.

- `rushx write-translations --locale zh-cn` - Update the `i18n/*.json` files with any new strings.


## Deployment

1. If you will manually copy the files to a server, you can build the **apps/sparo/build** folder like this:

   ```shell
   cd apps/website
   rushx build
   ```

2. To automatically deploy to GitHub Pages (as an administrator):

   ```shell
   # If you are using HTTPS authentication for GitHub:
   cd apps/website
   GIT_USER=<Your GitHub username> rushx deploy
   ```

   ```
   # If you are using SSH authentication for GitHub:
   USE_SSH=true rushx deploy
   ```

## See also

- [Deployment](https://docusaurus.io/docs/deployment) from the Docusaurus help

