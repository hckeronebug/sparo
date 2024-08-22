---
title: <profile-name>.json
---

To initialize a new Sparo profile, you can copy and paste the contents of this template.

**common/sparo-profiles/&lt;profile-name&gt;.json**
```js
/**
 * OWNER:   <your team name>
 * PURPOSE: <what you use this profile for>
 */
{
  "$schema": "https://tiktok.github.io/sparo/schemas/sparo-profile.schema.json",

  /**
   * A list of Rush project selectors indicating the project folders to be
   * included for sparse checkout.  The selectors will be combined to make
   * the union superset of projects.  See the Rush selector docs for details:
   * https://rushjs.io/pages/developer/selecting_subsets/
   */
  "selections": [
    /**
     * For example, include all Rush projects tagged with "tag:my-team"
     * as well as the dependency workspace projects needed to build them.
     * To learn about Rush project tags, see this documentation:
     * https://rushjs.io/pages/developer/project_tags/
     */
    // {
    //   "selector": "--to",
    //   "argument": "tag:my-team"
    // },
    /**
     * For example, include the project called "my-library", as well as all
     * projects that are impacted by changes to it, as well as the dependency
     * projects needed to build everything.
     */
    // {
    //   "selector": "--from",
    //   "argument": "my-library"
    // }
  ],

  /**
   * A list of arbitrary additional folders to be included for checkout,
   * not necessarily corresponding to any workspace project.
   * The paths should use forward slashes, without a leading slash, and should be to the 
   * root folder of the monorepo.  Wildcards and glob patterns are not supported for
   * performance reasons.
   */
  "includeFolders": [
    // "path/to/include"
  ],

  /**
   * A list of folders to be excluded from the checkout.  This field takes precedence
   * over the "includeFolders" and "selections" fields, guaranteeing that the
   * specified path will definitely not be included.
   * The paths should use forward slashes, without a leading slash, and should be to the 
   * root folder of the monorepo.  Wildcards and glob patterns are not supported for
   * performance reasons.
   */
  "excludeFolders": [
    // "path/to/exclude"
  ]
}
```

## See also

- [Sparo profiles](../guide/sparo_profiles.md)
