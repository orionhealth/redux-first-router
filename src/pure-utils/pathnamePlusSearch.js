// @flow
type Location = {
  pathname: string,
  search?: string,
  // this is npm history `location`, not our fragment.
  hash? : string
}

export default ({ pathname, search, hash = '' }: Location) => {
  if (search) {
    if (search.indexOf('?') !== 0) {
      search = `?${search}`
    }
    return `${pathname}${search}${hash}`
  }
  return `${pathname}${hash}`
}
