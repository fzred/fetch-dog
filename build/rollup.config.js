const buble = require('rollup-plugin-buble')
import includePaths from 'rollup-plugin-includepaths';
const version = process.env.VERSION || require('../package.json').version

let includePathOptions = {
  include: {},
  external: [],
  extensions: ['.js', '.json']
}
export default {
  entry: 'src/index.js',
  dest: 'dist/fetch-dog.js',
  format: 'umd',
  moduleName: 'FetchDog',
  plugins: [includePaths(includePathOptions)],
//  plugins: [buble()],
  banner: `/**
 * fetch-dog v${version}
 * (c) ${new Date().getFullYear()} 方增鸿
 * @license MIT
 */`
}
