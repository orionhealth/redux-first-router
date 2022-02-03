// @flow
import type { Action, Location, ReceivedAction, History } from '../flow-types'
import urlFromPath from './urlFromPath';

export default (
  pathname: string,
  action: ReceivedAction,
  prev: Location,
  history: History, // not used currently, but be brought back
  kind: ?string
): Action => {
  const { type, payload = {}, meta = {} } = action
  const query = action.query || meta.query || payload.query
  const fragment = action.fragment || meta.fragment || payload.fragment || '';

  const url = urlFromPath(pathname);
  let search = url.search;
  if (search && search.indexOf('?') === 0) {
    search = search.substring(1)
  }
  const hash = url.hash;

  return {
    ...action,
    ...(action.query && { query }),
    ...(action.fragment && { fragment }),
    type,
    payload,
    meta: {
      ...meta,
      ...(meta.query && { query }),
      ...(meta.fragment && { fragment }),
      location: {
        current: {
          pathname: url.pathname,
          type,
          payload,
          // we store the fragment and query in the payload to make it easier for
          // downstream apps to access the route data. Otherwise,
          // apps need to look inside the meta object which is a
          // burden. This is a divergence from the parent library
          ...(query && { query, search }),
          ...(fragment && { fragment, hash })
        },
        prev,
        kind,
        history: undefined
      }
    }
  }
}

export const nestHistory = (history: History) =>
  (history.entries
    ? {
      index: history.index,
      length: history.entries.length,
      entries: history.entries.slice(0) // history.entries.map(entry => entry.pathname)
    }
    : undefined)
