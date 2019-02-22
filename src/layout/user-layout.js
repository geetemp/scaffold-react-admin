import React from "react";
import "./user-layout.scss";

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className="container">
        <div className="content">
          {children}
        </div>
      </div>
    );
  }
}

export default UserLayout;
