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

  static merge(source, target) {
    const { state, actions, reducers } = source;
    const {
      state: tState,
      actions: tActions,
      reducers: tReducers,
      namespace,
      ...tOthers
    } = target;
    return {
      ...source,
      state: {
        ...state,
        ...tState
      },
      actions: {
        ...actions,
        ...tActions
      },
      reducers: {
        ...reducers,
        ...tReducers
      },
      ...tOthers
    };
  }

  [asyncActionFactry](asyncFunc, namespace) {
    const that = this;
    return function() {
      const passArgument = Array.prototype.slice.call(arguments);
      return function(dispatch, getState) {
        const customDispatch = action => {
          let { type } = action;
          type = /\//.test(type) ? type : `${namespace}/${action.type}`;
          dispatch({
            ...action,
            type
          });
        };
        that.dispatch = customDispatch;
        that.getState = getState;
        return asyncFunc.apply(that, [...passArgument]);
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
      lastActions[actionName] = this[asyncActionFactry](
        actions[actionName],
        namespace
      );
      return lastActions;
    }, asyncActions);

    this.actions = { ...normalActions, ...asyncActions };
  }
}
