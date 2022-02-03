export default (path: string) => {
  // Its easier to manipulate the path and get the query and fragments strings using URL.
  return new URL(path, 'https://www.redux-first-router-dummy.org');
};
