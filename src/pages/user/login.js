import React, { PureComponent } from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { connect } from "react-redux";
import userModel from "store/reducers/user";
import "./login.scss";

const FormItem = Form.Item;
const LoginForm = Form.create()(
  class Login extends PureComponent {
    handleSubmit = e => {
      const { login } = this.props;
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          login(values);
        }
      });
    };

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="login-form">
          <h1>用户登录</h1>
          <FormItem>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "请输入您的账号" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="请输入您的账号"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入您的密码" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="请输入您的密码"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator("remember_me", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>自动登录</Checkbox>)}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </FormItem>
        </Form>
      );
    }
  }
);

export default connect(
  null,
  { ...userModel.actions }
)(LoginForm);
