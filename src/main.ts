import * as core from '@actions/core'
import markdownMagic from 'markdown-magic'

import * as fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import { getLanguage } from './utils/linguist'

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

    markdownFiles.map(async markdownFile => {
      core.info('Processing ' + markdownFile)

      const config: markdownMagic.Configuration = {
        matchWord: 'MD-CODE-INJECT',
        transforms: {
          CODE: (content: string, options: { src: string }) => {
            const filePath = path.join(path.dirname(markdownFile), options.src)
            const language = getLanguage(filePath)
            return `\'\'\' ${language}
              ${fs.readFileSync(filePath, 'utf-8')}
              \'\'\'
            `
          }
        }
      }
      markdownMagic(markdownFile, config)
    })

    core.debug(new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
