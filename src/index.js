import express from 'express'
import path from 'path'
import router from './services/router'
import logger from './services/logger'

const app = express()

app.use(logger)

export default (dir, cb) => {
  if (typeof dir === 'function') {
    dir = path.resolve(__dirname, 'pages')
    cb = dir;
  }

  return router(app, dir, cb)
}