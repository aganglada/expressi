import chalk from 'chalk'
import emoji from 'node-emoji'

export default (req, res, next) => {
  console.log(`${emoji.get('thumbsup')} ${chalk.yellow(req.path)}`)
  next()
}