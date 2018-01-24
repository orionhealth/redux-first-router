import composePromise from '../../../core/composePromise'
import { complete } from './index'

export default (name, routes) => {
  for (const type in routes) {
    const route = routes[type]
    const cb = route[name]
    const callback = findCallback(name, routes, cb, route)
    if (callback) route[name] = callback
  }
}

const findCallback = (name, routes, callback, route) => {
  if (typeof callback === 'function') {
    return callback
  }
  else if (Array.isArray(callback)) {
    const callbacks = callback
    const pipeline = callbacks.map(cb => (req, next) => {
      cb = findCallback(name, routes, cb, route)

      const prom = Promise.resolve(cb(req))
      return prom.then(complete(next))
    })

    return composePromise(pipeline, null, true)
  }
  else if (typeof callback === 'string') {
    const type = callback
    const inheritedRoute = routes[`${route.scene}/${type}`] || routes[type]
    const cb = inheritedRoute[name]
    return findCallback(name, routes, cb, inheritedRoute)
  }
  else if (typeof route.inherit === 'string') {
    const type = route.inherit
    const inheritedRoute = routes[`${route.scene}/${type}`] || routes[type]
    const cb = inheritedRoute[name]
    return findCallback(name, routes, cb, inheritedRoute)
  }
}