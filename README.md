# milkman
[![Node.js CI](https://github.com/nhomble/milkman/actions/workflows/node.js.yml/badge.svg)](https://github.com/nhomble/milkman/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/nhomble/milkman/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nhomble/milkman/actions/workflows/codeql-analysis.yml)

![demo](./docs/demo.gif)

cli driven http tester - it's just a postman clone

## Usage

```
index.js run [directory] [environment]

run milk in [directory] and filter optionally against [environment]

Options:
      --version      Show version number                               [boolean]
      --environment
  -h, --help         Show help                                         [boolean]
```

## Features

- all http methods supported by `axios`
- `mustache` templating
- scripts defined between requests
- loose dependency tree via the `dependsOn` parameter
- a `test` function available in script invocations
- context passing `Map<string, any>` across specs
- filtering resources by `metadata.labels.environment`

## Development

Run the examples locally!
```sh
cd integration/
docker-compose up -d
cd -
yarn cli run ./examples/wiremock
```