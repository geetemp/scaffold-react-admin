import React from "react";
import {USER_STORE_KEY} from "contants";

/**
 * init user info to redux
 * read user info from localStorage to redux
 */
export default class InitUserData extends React.PureComponent {
  constructor(props) {
    super(props);
    const userStr = localStorage.getItem(USER_STORE_KEY);
    const user = userStr ? JSON.parse(userStr) : {};
    props.store.dispatch({
      type: "user/setUser",
      payload: user
    });
  }

  render() {
    return this.props.children;
  }
}
