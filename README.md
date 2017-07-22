# A glimpse at yarn workspaces

yarn 0.27.x introduced the [yarn workspaces feature][1].

[1]: https://github.com/yarnpkg/yarn/issues/3294



## How To

First, enable yarn workspaces for a project in the root `package.json`.
At this point, it is enough to add an empty property `workspaces`:

```json
{
  "name": "a-glimpse-at-yarn-workspaces",
  "workspaces": [
  ]
}
```

When then executing yarn, it gives an error.
Why?
Workspaces are an experimental feature and need to be explicitly enabled.

```bash
$ yarn
yarn install v0.27.5
error The workspace feature is currently experimental and needs to be manually enabled - please add "workspaces-experimental true" to your .yarnrc file.
```

The cool thing is that workspaces can be enabled only for a specific project.
Adding `.yarnrc` to the project root and simply add the above line to it!

