const babel = require("@babel/core");
const fs = require('fs');
const path = require('path');

const source = `import React, {  useEffect, useState } from 'react';
import { logInfo } from './utils';
function App() {
  let [count, setCount] = useState(0)
  useEffect(() => {
    console.log('in App');
    logInfo('In esbuild demo')
  })
  const handleAdd = () => {
    setCount(++count)
  }
  return (
    <div className="App">
      App.js  count --- {count}
      <button onClick={handleAdd}>Add </button>
    </div >
  );
}

export default App;
`
const trans = babel.transformSync(source, {
  filename: 'code.tsx',
  presets: ["@babel/preset-typescript", "@babel/preset-react", "@babel/preset-env"],
  plugins: ["@babel/plugin-transform-runtime",  "@babel/plugin-syntax-jsx"]
})
console.log('trans', trans)
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
console.log('code', code)

fs.writeFileSync( path.resolve(__dirname, 'test.jsx'), code, )