import expressi from '../../src'
import path from 'path'

expressi(path.resolve(__dirname, 'pages'), (app) => {
  app.listen(4000, () => {
    console.log('Expressi running at port 4000')
  })
})

