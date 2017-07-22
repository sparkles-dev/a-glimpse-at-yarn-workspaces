# A glimpse at yarn workspaces

yarn 0.27.x introduced the [yarn workspaces feature][1].




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


## Building a multi-package Angular project

Let's now try to build a multi-package Angular project inspired by the project layout of [angular/angular][3]


```
demo
  |- .angular-cli.json
  |- package.json
packages
  |- common
       |- package.json
  |- components
       |- package.json
```

Then, we must give workspaces name and at least add the `name` property to the `package.json` files!

Example `packages/common/package.json`:

```json
{
  "name": "@foo/common",
  "version": "1.0.0",
  "private": true
}
```

Running commands in a single workspace:

```bash
$ yarn workspace @foo/common add @angular/common
$ yarn workspace @foo/components add @angular/http
```

What happened?

Yarn installs dependencies to the project's root folder, e.g. `node_modules/@angular`.
By node's module resolution algorithm, sub-projects will recursively walk up the file-tree until they find a `node_modules` folder with the right dependencies!

A little bit counter-intuitive, this does not add the dependencies to the sub-projects but rather to the top-level `package.json`!

Also, it creates symlinks from the top-level `node_modules/@foo` folder to the directories of the individual workspaces:

```bash
$ ls -l node_modules/@foo
total 24
lrwxr-xr-x  ...  common -> ../../packages/common
lrwxr-xr-x  ...  components -> ../../packages/components
lrwxr-xr-x  ...  demo-app -> ../../demo
```

What happens on dependency version conflicts?

Let's simulate that by adding to `demo/package.json`:

```json
{
  "name": "@foo/demo-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@angular/core": "4.2.0",
    "@angular/common": "4.2.0",
    "@angular/http": "4.2.0",
    "@angular/platform-browser": "4.2.0"
  }
}
```

```bash
$ rm yarn.lock
$ yarn install
yarn install v0.27.5
info No lockfile found.
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Saved lockfile.
Done in 2.32s.
$ cat node_modules/@angular/http/package.json
{
  "name": "@angular/http",
  "version": "4.3.1",
  "description": "Angular - the http service",
  "main": "./bundles/http.umd.js",
  ...
}
```

Uh, the install command silently installed the `4.3.1` version, even though `@foo/demo` specified the `4.2.0` version.
But wait, there's another `demo/node_modules` directory created now!

```bash
$ cat demo/node_modules/@angular/http/package.json
{
  "name": "@angular/http",
  "version": "4.2.0",
  "description": "Angular - the http service",
  "main": "./bundles/http.umd.js",
  ...
}
```

That means that `yarn install` installs local dependencies, if needed, next to the `package.json` of the workspace.
It tries to assemble global depencies of all worksapces next to the root-level `package.json`!

I suggest that working on different Angular versions within the same project isn't a very good idea.
So, when we change everything to depend on the `4.3.1` version and re-run:

```bash
$ rm -rf demo/node_modules
$ rm -rf node_modules
$ rm yarn.lock
$ yarn install
```

Now, we only get dependencies installed to the top-most `node_modules` directory, meaning that all workspaces share the same depencies!



[1]: https://github.com/yarnpkg/yarn/issues/3294
[2]: https://github.com/thejameskyle/rfcs-1/blob/workspaces/accepted/0000-workspaces.md
[3]: https://github.com/angular/angular
