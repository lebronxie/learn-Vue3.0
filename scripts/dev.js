/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
yarn dev dom

# specify the format to output
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false yarn dev
```
*/
console.log('我是第几个执行的： 这里是---> npm run dev')

const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')
const args = require('minimist')(process.argv.slice(2))
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
const formats = args.formats || args.f
const sourceMap = args.sourcemap || args.s
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

// console.log(args) //{ _: [] }
// console.log(target) //vue
// console.log(formats) //undefined
// console.log(sourceMap) //undefined
// console.log(commit) //15696ce

// 执行  C:\Users\lebron\Desktop\vue-next\node_modules\rollup\dist\bin
execa(
  'rollup',
  [
    '-wc',
    '--environment',
    // npm run dev 的时候 `COMMIT:15696ce,TARGET:vue,FORMATS:global,SOURCE_MAP:true`
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`,
      sourceMap ? `SOURCE_MAP:true` : ``
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
