const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['koatest.js'],
  bundle: true,
  platform: "node",
  loader: { '.js': 'jsx', '.tsx': 'tsx', '.ts': 'tsx' },
  inject: ['./react-shim.js'], // 在这里引入会注入每个文件

  outfile: 'out.js',
})