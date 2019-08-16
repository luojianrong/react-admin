import React, { Component } from 'react';
import data from '../../utils/store';
import {message,Layout,Spin } from 'antd';
import logo from '../../assets/images/logo.png';
import {reqValidateUser} from '../../api';
import {getItem}  from  '../../utils/storege';
import './index.less';
import {Route,Redirect,Switch} from 'react-router-dom'

import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Line from '../charts/line';
import Bar from '../charts/bar';
import Pie from '../charts/pie';


const { Header, Content, Footer, Sider } = Layout;

export default class  Admin extends Component {

  state = {
    collapsed:false,
    isDisplay:'block',
  }

  //检查用户是否登陆过
  checkLogin = () => {
    //判断内存中是否存在
    if (!data.user._id) {
      //内存中没有，判断本地中是否存在
      const user = getItem();
      //如果本地也没有，返回登录页面
      if (!user) {
        this.props.history.replace('/login');
        //跳转登录页面，返回值是undefined，值位false，会渲染admin，因此需要返回值位true，渲染loading.
        return true;
      }
      //如果有，则再次对用户信息进行校验
      reqValidateUser(user._id)
        .then(() => {
          //如果合法，将数据保存到内存中
          data.user = user;
          //更新状态
          this.setState({

          });
        })
        .catch((err) => {
          message.error("请先登录");
          this.props.history.replace('/login');
        })
      //需要loading
      return true;
      } else {
      //不需要loading
      return false;
    }
  };

  // 展开菜单项
  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      isDisplay: collapsed ? 'none' : 'block'
    })
  };

  render() {
    //根据返回值判断是否需要loading
    const isLoading= this.checkLogin();
    if (isLoading) return <Spin className="admin-loading" tip="loading...." size="large"/>;

    const  {collapsed,isDisplay} = this.state;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="admin-logo" >
            <img src={logo} alt="logo"/>
            <h1 style={{display:isDisplay}}>硅谷后台</h1>
          </div>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header style={{padding: 0 }}>
            <HeaderMain/>
          </Header>
          <Content style={{ margin: '65px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/user' component={User} />
              <Route path='/role' component={Role} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/pie' component={Pie} />
              <Redirect to='/home'/>
            </Switch>
          </div>

          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
};

