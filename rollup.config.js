import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'index.mjs',
  output: {
    dir: 'static',
    format: 'cjs'
  },
  plugins: [nodeResolve()]
};
