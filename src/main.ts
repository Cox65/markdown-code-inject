import * as core from '@actions/core'

import * as fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import { getLanguage } from './linguist/getLanguage'

type ReplacementOperation = {
  search: string
  value: string
}

const CODE_REGEX =
  /<!--\s*CODE:START\s+file=(?<fileName>.+?)\s*-->\n(?<content>[\s\S]*?)<!--\s*CODE:END\s*-->/g

export const run = async () => {
  try {
    core.debug(new Date().toTimeString())

    const searchPatterns = core.getInput('SEARCH_PATTERNS')
    const ignorePatterns = core.getInput('IGNORE_PATTERNS')

    core.debug(searchPatterns.toString())
    core.debug(ignorePatterns.toString())
    const markdownFiles = await glob(searchPatterns, {
      ignore: ignorePatterns
    })

    markdownFiles.map(markdownFile => {
      core.info('Processing ' + markdownFile)

      const templateFileContent = fs.readFileSync(markdownFile, 'utf8')
      const matches = [...templateFileContent.matchAll(CODE_REGEX)]
      const replacements = matches.map(match => {
        const filePath = path.join(
          path.dirname(markdownFile),
          match.groups!['filename']
        )

        const fileContent = fs.readFileSync(filePath, 'utf8')
        return {
          search: match[0],
          value: match[0].replace(
            match.groups!['content'],
            `\`\`\` ${getLanguage(match.groups!['filename'])}
${fileContent}
\`\`\``
          )
        } as ReplacementOperation
      })

      const transformedContent = replacements.reduce(
        (transformedText, replacement) => {
          return transformedText.replace(replacement.search, replacement.value)
        },
        templateFileContent
      )

      fs.writeFileSync(markdownFile, transformedContent)
    })

    core.debug(new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
