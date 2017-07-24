import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

const indexFile = '/index'

const exist = location => {
  try {
    const stat = fs.statSync(location);
    return (stat.isFile() || stat.isDirectory());
  } catch (err) {
    return false;
  }
}

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {

    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));

  });

  return filelist;
}

const getRoutes = (location) => new Promise((resolve) => {
  resolve({
    location,
    files: walkSync(location, [])
  })
})

const parseRoutes = ({ location, files }) => {
  return files.map(file => {
    let route = file.replace(new RegExp(`^${location}(.*)?.js$`, 'g'), '$1')
    const isIndex = route.indexOf(indexFile)

    if (isIndex > -1) {
      route = route
        .replace(indexFile, isIndex === 0 ? '/' : '')
        .replace('.', ':')
    } else {
      route = route.replace('.', '/:')
    }



    console.log(chalk.blue(route))

    return {
      file,
      route
    }
  })
}

const attachRouteToExpress = (app, routes) => {
  routes.forEach(({route, file}) => {
    app.get(route, require(file).default)
  })
}

export default (app, location, callback) => {
  if (!exist(location)) {
    throw new Error(`Cannot find routes folder specified (${location})`);
  }

  console.log(chalk.green('ROUTES'))
  console.log(chalk.green('----------------'))

    getRoutes(location)
      .then(parseRoutes)
      .then((routes) => {
        attachRouteToExpress(app, routes)
      })
      .then(() => callback(app))
}