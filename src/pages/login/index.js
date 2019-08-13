import React, { Component } from 'react';
import {Form,Input,Icon,Button} from 'antd';

import img from './logo.png';
import './index.less';

const Item = Form.Item;

export default class Login extends Component {
  render() {
    return <div className='login'>
      <header className='login-header'>
        <img src={img} alt="img"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <div className='login-section'>
        <h2>用户登录</h2>
        <Form>
          <Item>
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username"/>
          </Item>
          <Item>
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="password"/>
          </Item>
          <Item><Button type="primary" className="login-btn">登录</Button></Item>
        </Form>
      </div>

    </div>;
  }
}
