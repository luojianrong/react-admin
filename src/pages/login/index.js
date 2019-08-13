import React, { Component } from 'react';
import {Form,Input,Icon,Button,message} from 'antd';
import axios from 'axios';

import img from './logo.png';
import './index.less';

const Item = Form.Item;

class Login extends Component {

  validator = (rule,value,callback)=>{
    const reg = /^\w+$/;
    let fieldName = rule.field=== 'username' ? '用户名':'密码';

    if (!value){
      callback(`${fieldName}不能为空`);
    }else if (value.length<4){
      callback(`${fieldName}不能小于4位`);
    } else if (value.length>10){
      callback(`${fieldName}不能大于10位`);
    } else if (!reg.test(value)) {
      callback(`${fieldName}必须由数字字母下划线组成`);
    }
    callback();
  }

  goLogin = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((errors, values) =>{
      axios.post('http://localhost:3000/login',values)
        .then((respones)=>{
          const status = respones.data.status;
          if (status===0){
            //登录成功
            message.success('登录成功')
          }else if (status ===1){
            //登录失败
            message.error('登录失败')
          }
        })
        .catch((err)=>{
          if (err) message.error("网络错误，请稍后再试")
        })
    });
  }

  render() {
    /*通过form属性，获取getFieldDecorator()，*/
    const {getFieldDecorator} = this.props.form;
    return <div className='login'>
      <header className='login-header'>
        <img src={img} alt="img"/>
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
              })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名"/>)
            }
          </Item>
          <Item>
            {
              getFieldDecorator(
              'password',
                {
                rules:[{ validator: this.validator }]
              })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码"/>)
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
