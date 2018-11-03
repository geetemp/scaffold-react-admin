import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import { Icon } from 'antd';
// import GlobalFooter from '@/components/GlobalFooter';
// import styles from './UserLayout.scss';
// import logo from '../assets/logo.svg';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
  </Fragment>
);

class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className="container">
        <div className="content">
          <div className="top">
            <div className="header">
              <Link to="/">
                {/* <img alt="logo" className="logo" src={logo} /> */}
                <span className="title">Ant Design</span>
              </Link>
            </div>
            <div className="desc">Ant Design 是西湖区最具影响力的 Web 设计规范</div>
          </div>
          {children}
        </div>
        {/* <GlobalFooter links={links} copyright={copyright} /> */}
        {/* <style jsx>{styles}</style> */}
      </div>
    );
  }
}

export default UserLayout;
