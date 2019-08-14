import React, { Component } from 'react';
import data from '../../utils/store';
import {message,Layout} from 'antd';
import LeftNav from '../../components/left-nav';
import logo from '../../assets/images/logo.png';
import {checkLogin} from '../../api';
import {getItem}  from  '../../utils/storege';
import './index.less'

const { Header, Content, Footer, Sider } = Layout;

export default class  Admin extends Component {

  state = {
    isLoading: true,
    collapsed:false,
    isDisplay:'block'
  }

  checkLogin = () => {
    //判断内存中是否存在
    if (!data.user._id) {
      //内存中没有，判断本地中是否存在
      const user = getItem();
      //如果本地也没有，返回登录页面
      if (!user) {
        this.props.history.replace('/login');
        return true;
      }
      //如果有，则再次对用户信息进行校验

      checkLogin(user._id)
        .then(() => {
          //如果合法，将数据保存到内存中
          data.user = user;
          //更新状态
          this.setState({
            isLoading: false
          });
        })
        .catch((err) => {
          message.error("请先登录");
          this.props.history.replace('/login');
        })
      return true;
      } else {
      return false;
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="admin-logo" >
            <img src={logo} alt="logo"/>
            <h1>硅谷后台</h1>
          </div>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
};

