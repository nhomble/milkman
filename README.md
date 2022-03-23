# milkman
[![Node.js CI](https://github.com/nhomble/milkman/actions/workflows/node.js.yml/badge.svg)](https://github.com/nhomble/milkman/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/nhomble/milkman/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nhomble/milkman/actions/workflows/codeql-analysis.yml)

![demo](./docs/demo.gif)

cli driven http tester - it's just a postman clone

## Usage

```
Commands:
  index.js discover [directory]  discover milk in [directory]
  index.js run [directory]       run milk in [directory]

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

## Features

- all http methods supported by `axios`
- `mustache` templating
- scripts defined between requests
- loose dependency tree via the `dependsOn` parameter
- a `test` function available in script invocations
- context passing `Map<string, any>` across specs