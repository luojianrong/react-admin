import React, { Component } from 'react';
import {Form,Input,Icon,Button,message} from 'antd';
import {reqLogin} from '../../api';
import data from '../../utils/store';
import {setItem} from '../../utils/storege';

import logo from '../../assets/images/logo.png';
import './index.less';

const Item = Form.Item;


class Login extends Component {

  //表单校验方法
  /*rule：通过该对象可以知道是哪一个表单在进行校验
  * value：表单的输入值
  * callback()：有值表示失败的校验，没值表示成功的校验*/
  validator = (rule, value, callback) => {
    const reg = /^\w+$/;
    //rule.field：获取到表单的标志名
    let fieldName = rule.field === 'username' ? '用户名' : '密码';

    if (!value) {
      callback(`${fieldName}不能为空`);
    } else if (value.length < 4) {
      callback(`${fieldName}不能小于4位`);
    } else if (value.length > 10) {
      callback(`${fieldName}不能大于10位`);
    } else if (!reg.test(value)) {
      callback(`${fieldName}必须由数字字母下划线组成`);
    }
    callback();
  }

  //点击登录的方法
  goLogin = (e) => {
    //取消默认事件
    e.preventDefault();
    //validateFields()：可以校验并获取一组输入域的值和error，当errors对象为空时表示校验成功
    this.props.form.validateFields((errors, values) => {
      //解构赋值输入域的内容
      const {username, password} = values;
      //发送请求登录
      reqLogin(username, password)
        .then((respones) => {
          //登录成功的回调
          message.success('登录成功');
          //保存数据到内存中
          data.user = respones;
          //保存数据到本地中
          setItem(respones);
          //登录成功，切换到admin首页
          this.props.history.replace('/');
        })
        .catch((err) => {
          //登录失败的回调
          message.error("用户名或密码错误");
          //resetFields：满足情况下清空输入值的值
          this.props.form.resetFields(['password'])
        })
    });
  }

  render() {
    /*通过form属性，获取getFieldDecorator()，*/
    const {getFieldDecorator} = this.props.form;
    return <div className='login'>
      <header className='login-header'>
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <div className='login-section'>
        <h2>用户登录</h2>
        <Form>
          <Item>
            {
              getFieldDecorator(
                'username', {
                  rules: [
                    /*{ required: true, message: 'Please input your username!' },
                    { min:4,message:'用户名不能小于4位'},
                    { max:10,message:'用户名不能大于10位'},
                    { pattern:/^\w$/,message:"密码必须由数字字母下划线组成"}*/
                    {validator: this.validator}
                  ],
                })(<Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="请输入用户名"/>)
            }
          </Item>
          <Item>
            {
              /*getFieldDecorator:用于表单进行双向绑定，是一个高阶组件*/
              getFieldDecorator(
                'password',
                {
                  rules: [{validator: this.validator}]
                })(<Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                          placeholder="请输入密码"/>)
            }
          </Item>
          <Item><Button type="primary" className="login-btn" onClick={this.goLogin}>登录</Button></Item>
        </Form>
      </div>

    </div>;
  }
}

// Form.create()()，用于创建组件的form属性，通过this.props.form获取该属性，该属性是一个对象，拥有操作表单的多个方法
export default  Form.create()(Login);
