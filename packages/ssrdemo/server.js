import Koa from 'koa'
import ReactDOMServer from 'react-dom/server'
import App from './src/App'
const app = new Koa()

const data = renderToString(<App />)
app.use((ctx,next)=>{
  ctx.body = `
    <html>
    <head>
        <title>SSR</title>
    </head>
      <body>
          <p>${data}</p>
      </body>
    </html>
  `
})

app.listen(8001,()=>{
  console.log('koa初体验服务器启动成功~，链接为：http://localhost:8001')
})