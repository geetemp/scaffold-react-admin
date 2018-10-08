import AuthCheck from "./AuthCheck";
import RenderAuthCheck from "./RenderAuthCheck";

// 获取权限 正式业务需要调整
const getAuth = (str) => {
  // ['admin', 'user'];
  const authorityString =
    typeof str === "undefined"
      ? localStorage.getItem("authority")
      : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === "string") {
    return [authority];
  }
  return authority || ["admin"];
};

// 如果需要特殊的获取权限，可以使用这里
export const renderAuthCheck = RenderAuthCheck(AuthCheck);

export default RenderAuthCheck(AuthCheck)(getAuth("a"));  // TODO正式业务需要调整，只做演示
