import React from 'react';

export default class UserLayout extends React.PureComponent {

  render() {
    const {
      children
    } = this.props;
    return <div>user<div>{children}</div></div>
  }
}