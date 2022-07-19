const fse = require('fs-extra');
const fs = require('fs');
const babel = require('@babel/core');

module.exports = options => {
  return {
    name: "auto-delete-console",
    setup(build) {
      build.onLoad({ filter: /\.(js|ts|jsx|tsx)$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        
        const trans = babel.transformSync(source, {
          filename: 'entry.tsx',
          presets: ["@babel/preset-typescript", "@babel/preset-react", "@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime",  "@babel/plugin-syntax-jsx"]
        })
        const ast = babel.parse(trans.code);
        babel.traverse(ast, {
          CallExpression(path) {
            const memberExpression = path.node.callee;
            if(memberExpression.object && memberExpression.object.name === 'console') {
              path.remove()
            }
          }
        });
        const { code } = babel.transformFromAst(ast);
        return {
          contents: code,
          loader: 'js'
        }
      })
    }
  }
}