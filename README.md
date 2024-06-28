# JPM
=================

jolie package manager

<!-- toc -->
* [JPM](#jpm)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @jolie/jpm
$ jpm COMMAND
running command...
$ jpm (--version)
@jolie/jpm/3.0.1 linux-x64 node-v20.12.1
$ jpm --help [COMMAND]
USAGE
  $ jpm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`jpm help [COMMANDS]`](#jpm-help-commands)
* [`jpm init [PATH]`](#jpm-init-path)
* [`jpm install TARGET`](#jpm-install-target)
* [`jpm remove TARGET`](#jpm-remove-target)

## `jpm help [COMMANDS]`

Display help for jpm.

```
USAGE
  $ jpm help [COMMANDS...] [-n]

ARGUMENTS
  COMMANDS...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for jpm.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `jpm init [PATH]`

Generate jpm's specific configuration to package.json

```
USAGE
  $ jpm init [PATH...]

ARGUMENTS
  PATH...  Target package

DESCRIPTION
  Generate jpm's specific configuration to package.json

EXAMPLES
  $ jpm init
      add jpm related fields to package.json in current working directory

  $ jpm init [path]
      add jpm related fields to package.json in specify path
```

_See code: [src/commands/init.ts](https://github.com/jolie/jpm/blob/v3.0.1/src/commands/init.ts)_

## `jpm install TARGET`

Add Jolie related dependency to the project

```
USAGE
  $ jpm install TARGET [-r mvn|npm]

ARGUMENTS
  TARGET  Target package

FLAGS
  -r, --repo=<option>  specify the lookup repository
                       <options: mvn|npm>

DESCRIPTION
  Add Jolie related dependency to the project

EXAMPLES
  $ jpm install
  scan entries from package.json and download all dependencies

  $ jpm install @jolie/websocket
  add @jolie/websocket into the project

  $ jpm install org.jsoup:jsoup
  add maven's jsoup into the project

  $ jpm install jolie-jsoup@latest
  add jolie-jsoup with latest tag into the project
```

_See code: [src/commands/install.ts](https://github.com/jolie/jpm/blob/v3.0.1/src/commands/install.ts)_

## `jpm remove TARGET`

Remove Jolie related dependency to the project

```
USAGE
  $ jpm remove TARGET

ARGUMENTS
  TARGET  Target package

DESCRIPTION
  Remove Jolie related dependency to the project
  Currently, it removes the corresponding entry on package.json file and perform install command


EXAMPLES
  $ jpm remove jolie-jsoup
      Remove jolie-jsoup from the dependencies
```

_See code: [src/commands/remove.ts](https://github.com/jolie/jpm/blob/v3.0.1/src/commands/remove.ts)_
<!-- commandsstop -->
