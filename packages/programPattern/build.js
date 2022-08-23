const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['iop/provider_injection.ts'],
  bundle: true,
  platform: "node",
  loader: { '.js': 'jsx', '.tsx': 'tsx', '.tsx': 'tsx' },
  // inject: ['./react-shim.js'], // 在这里引入会注入每个文件

  outfile: 'out.js',
})