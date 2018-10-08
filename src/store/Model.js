/**
 * Model base class
 */
const asyncActionFactry = Symbol("asyncActionFactry");

export default class Model {
  static getInstance = function(clazz) {
    const instance = new clazz();
    instance.createActions();
    return instance;
  };

  [asyncActionFactry](asyncFunc) {
    return function() {
      const passArgument = Array.prototype.slice.call(arguments);
      return function(dispatch, getState) {
        return asyncFunc.apply({ dispatch, getState }, [...passArgument]);
      };
    };
  }

  createActions() {
    const { reducers = {}, namespace = "app", actions = {} } = this;
    const normalActions = {};
    Object.keys(reducers).reduce((lastActions, reducerName) => {
      lastActions[reducerName] = function() {
        return {
          type: `${namespace}/${reducerName}`,
          payload: arguments[0]
        };
      };
      return lastActions;
    }, normalActions);

    const asyncActions = {};
    Object.keys(actions).reduce((lastActions, actionName) => {
      lastActions[actionName] = this[asyncActionFactry](actions[actionName]);
      return lastActions;
    }, asyncActions);

    this.actions = { ...normalActions, ...asyncActions };
  }
}
