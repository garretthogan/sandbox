import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.js',
  output: {
    exports: 'auto',
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [copy({ targets: [{src: 'static/*', dest: 'dist'}] })]
};
