# markdown-code-inject

A Github action that updates markdown files by injecting files content from
repository

<!-- CODE:START file=./action.yml -->
``` MiniYAML
name: 'Markdown Code Inject'
description: 'Replace references to files by code tags'
author: 'LAFFARGUE Nicolas'

inputs:
  searchPatterns:
    description:
      'A comma separated list of patterns used to search for Markdown files to
      transform.'
    required: false
    default: '**/*.md'
  ignorePatterns:
    description: 'The list of patterns for files to exclude.'
    required: false
    default: 'node_modules/**'

runs:
  using: node20
  main: dist/index.js

```
<!-- CODE:END -->
