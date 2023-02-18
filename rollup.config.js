import typescript from '@rollup/plugin-typescript'
import pluginCommonjs from '@rollup/plugin-commonjs'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import pluginAlias from '@rollup/plugin-alias'
import { babel as pluginBabel } from '@rollup/plugin-babel'
import { terser as pluginTerser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import * as path from 'path'
import {
  name as pkgName,
  version as pkgVersion,
  license as pkgLicense,
} from './package.json'
import json from '@rollup/plugin-json'

const isProd = process.env.NODE_ENV === 'production'

const envPlugin = isProd
  ? [pluginTerser()]
  : [
      serve({
        contentBase: ['src', 'dist'],
      }),
    ]

const banner = `/**
 * @license
 * ${pkgName} v${pkgVersion}
 * Released under the ${pkgLicense} license.
*/
`
const customResolver = pluginNodeResolve({
  extensions: ['.ts', '.js'],
})
const projectRootDir = path.resolve(__dirname)

const plugins = [
  pluginAlias({
    entries: [
      {
        find: '@',
        replacement: path.resolve(projectRootDir, './src'),
      },
      {
        find: '@root',
        replacement: projectRootDir,
      },
    ],
    customResolver,
  }),
  typescript(),
  pluginCommonjs({
    extensions: ['.js'],
  }),
  pluginNodeResolve({
    browser: true,
  }),
  pluginBabel({
    extensions: ['.js', '.ts'],
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  json(),
  ...envPlugin,
]

export default [
  // es module
  {
    input: 'src/core/index.ts',
    output: [
      {
        file: 'dist/esm/AASDK.js',
        format: 'es',
        banner,
      },
    ],
    plugins,
  },
  // umd
  {
    input: 'src/core/index.ts',
    output: [
      {
        name: 'AASDK',
        file: `dist/umd/AASDK.${pkgVersion}.js`,
        format: 'umd',
        banner,
      },
    ],
    plugins,
  },
  {
    input: 'src/core/index.ts',
    output: [
      {
        name: 'AASDK',
        file: `dist/umd/AASDK.latest.js`,
        format: 'umd',
        banner,
      },
    ],
    plugins,
  },
]
