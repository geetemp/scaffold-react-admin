import Model from "../model";

export default Model.getInstance(
  class extends Model {
    namespace = "global";

    state = {
      collapsed: true,
      pathname: "",
      drawerStack: []
    };

    actions = {
      updateDrawerStack(data) {
        let drawerStack = this.getState().global.drawerStack;
        if (data.type === "add") {
          if (drawerStack.length !== 0) {
            let beforeDrawer = drawerStack[drawerStack.length - 1];
            // 添加时候把栈中前一个drawer隐藏起来
            beforeDrawer.componentProps.stackVisible = false;
          }

          // data.currentState = this.getState()[data.model];
          drawerStack = drawerStack.concat(data);
        }
        if (data.type === "pop") {
          drawerStack = drawerStack.slice(0, drawerStack.length - 1);
          let current = drawerStack[drawerStack.length - 1];
          if (drawerStack.length !== 0) {
            // 出栈时候把栈中前一个drawer显示
            current.componentProps.stackVisible = true;
          }
        }
        this.dispatch({
          type: "global/updateStack",
          payload: drawerStack
        });
      }
    };

    reducers = {
      updateStack(state, { payload: data }) {
        return { ...state, drawerStack: data };
      },

      changeLayoutCollapsed(state, { payload: collapsed }) {
        return {
          ...state,
          collapsed
        };
      },

      setPathname(state, { payload: pathname }) {
        return {
          ...state,
          pathname
        };
      }
    };
  }
);
