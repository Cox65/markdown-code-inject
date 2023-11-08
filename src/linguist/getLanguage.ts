import * as fs from 'fs'
import * as yaml from 'js-yaml'
import path from 'path'

type Languages = Record<
  string,
  {
    extensions: string[]
  }
>

const languages = yaml.load(
  fs.readFileSync(path.join(__dirname, 'languages.yml'), 'utf-8')
) as Languages

export const getLanguage = (filepath: string) => {
  const extension = path.extname(filepath)
  const matchingEntry = Object.entries(languages).find(
    ([languageName, definition]) => {
      return definition.extensions && definition.extensions.includes(extension)
    }
  )
  return matchingEntry ? matchingEntry[0] : undefined
}
