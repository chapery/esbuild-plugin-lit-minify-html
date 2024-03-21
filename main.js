import babelParser from '@babel/parser'
import babelGenerator from '@babel/generator'
import babelTraverse from '@babel/traverse'
import babelTypes from '@babel/types'
import { minify } from 'html-minifier-terser'
import { readFile } from 'fs/promises'

const { default: generator } = babelGenerator
const { default: traverse } = babelTraverse

const wrapperTag = {
  opening: '<html>',
  closing: '</html>',
}

function uuid() {
  return Math.random()
    .toString(36)
    .replace(/^0\.\d*/, '')
}

async function minifyTaggedTemplate(quasiNode) {
  const quasis = quasiNode.node.quasis.map((quasi) => quasi.value.raw)
  const expressionPlaceholder = uuid()
  let template = wrapperTag.opening + quasis.join(expressionPlaceholder) + wrapperTag.closing
  try {
    template = await minify(template, {
      caseSensitive: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
    })

    if (!template.startsWith(wrapperTag.opening) || !template.endsWith(wrapperTag.closing)) {
      throw 'unexpected html structure after minified'
    }

    const minifiedQuasis = template
      .slice(wrapperTag.opening.length, -wrapperTag.closing.length)
      .split(expressionPlaceholder)
    if (minifiedQuasis.length !== quasis.length) {
      throw 'fragment number is wrong after minified'
    }

    minifiedQuasis.forEach((quasis, index, itself) => {
      quasiNode.node.quasis[index] = babelTypes.templateElement({ raw: quasis }, index === itself.length - 1)
    })
  } catch (error) {
    console.error(error.message)
  }
}

export default function () {
  return {
    name: 'lit-minify-html',
    setup(build) {
      build.onLoad({ filter: /\.(js|ts)$/ }, async (args) => {
        const content = await readFile(args.path, { encoding: 'utf-8' })
        const ast = babelParser.parse(content, { sourceType: 'module', plugins: ['decorators', 'typescript'] })
        const minifyProcessings = []
        traverse(ast, {
          TaggedTemplateExpression(path) {
            if (path.node.tag.name === 'html') {
              minifyProcessings.push(minifyTaggedTemplate(path.get('quasi')))
            }
          },
        })
        await Promise.all(minifyProcessings)
        const contents = generator(ast).code
        return {
          contents,
          loader: args.path.match(/(?<=\.)\w+$/).toString(),
        }
      })
    },
  }
}
