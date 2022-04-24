import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';

// import { terser } from "rollup-plugin-terser";
// import commonjs from "rollup-plugin-commonjs";

export default {
  input: './src/index.js',
  output: [
    { file: './dist/index.js', format: 'cjs' },
    { file: './es/index.js', format: 'es' },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    postcss({
      minimize: true,
      sourceMap: true,
      // extract css to the same
      // extract: true, //
      extensions: [".less", ".css"],
    })
  ],
  external: ['react'],
}
