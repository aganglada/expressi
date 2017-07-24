import express from 'express'
import path from 'path'
import router from './router'

const app = express()

export default (dir, cb) => {
  if (typeof dir === 'function') {
    dir = path.resolve(__dirname, 'pages')
    cb = dir;
  }

  return router(app, dir, cb)
}