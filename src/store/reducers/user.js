import Model from "../Model";
import { history } from "root";

import { clearAuthority, setAuthority } from "utils/authority";
import { reloadAuthorized } from "utils/Authorized";
import { USER_STORE_KEY } from "contants";

const userInfo = {
  name: "geetemp",
  roles: "admin"
};

export default Model.getInstance(
  class extends Model {
    namespace = "user";

    state = {};

    actions = {
      async login(param) {
        //store user info to redux
        this.dispatch({
          type: "setUser",
          payload: userInfo
        });
        //store user info to localStorage
        localStorage.setItem(USER_STORE_KEY, JSON.stringify(userInfo));
        //set authority
        setAuthority(userInfo.roles);
        reloadAuthorized();
        history.replace("/");
      },

      async isLogin() {
        const { user } = this.getState();
        !Object.keys(user).length ? history.replace("/user/login") : void 0;
      },

      async logout() {
        //clear user info from redux
        this.dispatch({
          type: "setUser",
          payload: {}
        });
        //clear user info from localStorage
        localStorage.removeItem(USER_STORE_KEY);
        //clear authority
        clearAuthority();
        history.replace("/user/login");
      }
    };

    reducers = {
      setUser(state, { payload: loginReqRes }) {
        return {...loginReqRes};
      }
    };
  }
);
