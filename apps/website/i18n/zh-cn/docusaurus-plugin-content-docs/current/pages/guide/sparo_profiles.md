---
title: Sparo profiles
---

## Background

Git's sparse checkout feature normally relies on a collection of glob patterns that are stored in the `.git/info/sparse-checkout` config file.  The Git maintainers found that regular glob syntax was too inefficient, so they introduced a ["cone mode"](https://git-scm.com/docs/git-sparse-checkout#_internalsnon_cone_problems) glob interpretation that ignores file-matching patterns and only matches directories.

The syntax looks something like this:

**.git/info/sparse-checkout  example**
```
/*
!/*/
/apps/
!/apps/*/
/apps/my-app/
!/apps/my-app/*/
/apps/my-app/_/
```

To simplify management, Git also provides a `git sparse-checkout` command that simplifies the syntax for adding/removing patterns from this file.  However, in a large monorepo with hundreds of projects, managing these globs would nonetheless be confusing and error-prone.

## Sparo improves sparse checkout

Sparo makes life easier by generating the `.git/info/sparse-checkout` configuration automatically from config files called **profiles.**  This offers many benefits:

- Sparo profiles are defined using [project selectors](https://rushjs.io/pages/developer/selecting_subsets/#--to), for example: _"Give me **app1**, **app2**, and all the projects needed to build them."_ This is more concise and maintainable than specifying globs.

- Profiles are stored in a config file and committed to Git.  This makes it easy to share them with your teammates.

- Profiles are automatically updated when switching between branches, which ensures deterministic results.  For example, when checking out a very old branch, you want the old profile definition, not today's version of it.

- You can combine multiple profiles together (`sparo checkout --profile team1 --profile team2`), which selects the union of their projects.  This is useful for example when modifying a library project that is consumed by projects belonging to several other teams.  You could check out their projects using `--from the-library` of course, but it's likely those other teams will have included other relevant projects in their profiles.

- Sparo avoids common mistakes by imposing additional restrictions beyond `git sparse-checkout`.  This avoids mistakes such as trying to switch to a profile that is missing a project folder containing files that are locally modified. It is better for users to stash or commit such modifications first.

## Best practices for profiles

You an add JSON comments to your profile config files.  In a large shared codebase, we recommend adding a standardized header to the top of your files indicating their ownership and purpose.  Something like this:

**common/sparo-profiles/example-profile.json**
```js
/**
 * OWNER:   Customer service team
 * PURPOSE: Use this profile when working on the customer service apps.
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
     {
        "selector": "--to",
        "argument": "tag:cs-dashboard"
     },
     {
        "selector": "--to",
        "argument": "tag:cs-tools"
     }
  ]
}
```

## Combining profiles

The simple way to combine profiles is to specify `--profile` multiple times.  For example:

```sh
# Check out the union of profiles team-a.json, team-b.json, team-c.json
# NOTE: This will replace whatever profile selection was already checked out.
sparo checkout --profile team-a --profile team-b --profile team-c
```

You can also use `--add-profile` to incrementally combine them.  For example:

```shell
# These three commands are equivalent to the above command.
sparo checkout --profile team-a
sparo checkout --add-profile team-b
sparo checkout --add-profile team-c
```

How to checkout no profile at all? That is, how to return to the initial state of a clean `sparo clone` that only includes the [skeleton](../reference/skeleton_folders.md) folders?  The answer is to use the `--no-profile` parameter:

```shell
# NOT IMPLEMENTED YET - check out just the skeleton folders
# without applying any profiles
sparo checkout --no-profile
```

If `sparo checkout` without `--profile` or `--add-profile` or `--no-profile`, then the existing profile selection is preserved.  In other words, your profile choices are generally "sticky" across commands.


## Querying profiles

Users can discover available profiles in the current branch by invoking the [sparo list-profiles](../commands/sparo_list-profiles.md) command.  The `--project` parameter enables you to query relevant profiles for a given project.  For example:

```shell
# Suppose you need to make a fix for the "example-app" project.

# Which sparse checkout profiles include the "example-app" project?
sparo list-profiles --project example-app

# Great, let's add the "example-profile" result to our current checkout
# (combining it with the existing profile).
sparo checkout --add-profile example-profile
```

## See also

- [&lt;profile-name&gt;.json](../configs/profile_json.md) config file
