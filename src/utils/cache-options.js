import _ from "underscore";
/**
 * 缓存方法
 * @param {function} req 请求对象
 * @param {Array} unNeedCacheKeys 缓存配置(配置哪些require key需要缓存)
 */
const cacheOptions = (req, unNeedCacheKeys = []) => {
  if (!req || typeof req !== "function") throw req;
  let cacheData = {};
  return param => {
    let combineRes = {};
    const optionKeys = (param || "").split(",");
    if (!optionKeys.length) return Promise.resolve(combineRes);
    const cacheKeys = optionKeys.filter(
      key => unNeedCacheKeys.indexOf(key) === -1
    );
    const nocacheKeys = optionKeys.filter(
      //不需要缓存的keys
      key => unNeedCacheKeys.indexOf(key) >= 0
    );

    const cachedKeys = cacheKeys.filter(key => cacheData[key]);
    const unCachedKeys = cacheKeys.filter(key => !cacheData[key]);
    //如果有缓存的key，那么从缓存中读取
    if (cachedKeys.length) _.extend(combineRes, _.pick(cacheData, cachedKeys));

    let reqKeys = nocacheKeys.concat(unCachedKeys);
    //如果没有需要请求的keys
    if (!reqKeys.length) return Promise.resolve(combineRes);
    return req(reqKeys.join(",")).then(res => {
      if (res && res.code === 0) {
        _.extend(combineRes, res.data);
        //加入缓存
        if (unCachedKeys.length) {
          _.extend(cacheData, _.pick(res.data, unCachedKeys));
        }
      }
      return combineRes;
    });
  };
};

export default cacheOptions;
