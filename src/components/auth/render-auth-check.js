/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';
/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = AuthCheck => currentAuthority => {
  if (currentAuthority) {
    if (typeof currentAuthority === 'function') {
      CURRENT = currentAuthority();
    }
    if (
      Object.prototype.toString.call(currentAuthority) === '[object String]' ||
      Array.isArray(currentAuthority)
    ) {
      CURRENT = currentAuthority;
    }
  } else {
    CURRENT = 'NULL';
  }
  return AuthCheck;
};

export { CURRENT };
export default AuthCheck => renderAuthorize(AuthCheck);
