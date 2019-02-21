import React, {PureComponent} from "react";
import { Button } from "antd";
import "./index.scss";

/**
 * fallback UI for no authority
 */
export class Exception403 extends PureComponent{
  render() {
    const { history } = this.props;
    return (
      <div className="exception403-box bg">
        <div className="container">
          <div className="abnormal-show-box clear">
            <div className="left-show mg">
              <div className="img-box">
                <div className="img403" />
              </div>
            </div>
            <div className="right-show">
              <div className="title">403</div>
              <div className="des">抱歉，您没权限访问！</div>
              <div className="btn">
                <Button type="primary" onClick={() => history.push("/")}>
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * fallback UI for http 404 staut code
 */
export class Exception404 extends PureComponent {
  render() {
    const { history } = this.props;
    return (
      <div className="exception404-box bg">
        <div className="container">
          <div className="abnormal-show-box clear">
            <div className="left-show">
              <div className="img-box">
                <div className="img404" />
              </div>
            </div>
            <div className="right-show">
              <div className="title">404</div>
              <div className="des">抱歉，你访问的页面不存在！</div>
              <div className="btn">
                <Button type="primary" onClick={() => history.push("/")}>
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * fallback UI for http 500 staut code
 */
export class Exception500 extends PureComponent {
  render() {
    const { history } = this.props;
    return (
      <div className="exception500-box bg">
        <div className="container">
          <div className="abnormal-show-box clear">
            <div className="left-show mg">
              <div className="img-box">
                <div className="img500" />
              </div>
            </div>
            <div className="right-show">
              <div className="title">500</div>
              <div className="des">抱歉，服务器出错了！</div>
              <div className="btn">
                <Button type="primary" onClick={() => history.push("/")}>
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * fallback UI for client error
 */
export class ClientErrorFallback extends PureComponent {
  render() {
    const { history } = this.props;
    return (
      <div className="exception-client-error-box bg">
        <div className="container">
          <div className="abnormal-show-box clear">
            <div className="left-show mg">
              <div className="img-box">
                <div className="img500" />
              </div>
            </div>
            <div className="right-show">
              <div className="title">错误</div>
              <div className="des">抱歉，发送未知错误！</div>
              <div className="btn">
                <Button type="primary" onClick={() => history.push("/")}>
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
