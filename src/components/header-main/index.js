import React, { Component } from 'react';
import {Button,Modal} from 'antd';
import {withRouter} from  'react-router-dom';
import {removeItem} from '../../utils/storege';
import data from '../../utils/store';
import dayjs from 'dayjs';
import {reqWeather} from '../../api/index';
import {menuList} from '../../config'


import './index.less';

class HeaderMain extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: '',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      weather:'晴',
      dayPictureUrl:'http://api.map.baidu.com/images/weather/day/qing.png'
    }
  }
  /*state = {
    title: '',
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weather:'晴',
    dayPictureUrl:'http://api.map.baidu.com/images/weather/day/qing.png'
  }*/

  static getDerivedStateFromProps(nextProps,prevState){
    let {pathname} = nextProps.location;
    /*if (pathname === '/'){
      return {
        title: "首页"
      }
    }*/
    if (pathname.startsWith('/product')){
      pathname='/product'
    }

    for (let i= 0; i<menuList.length ; i++){
      const menu = menuList[i];

      if (menu.children){
        //如果是二级菜单，需要再一次遍历
        const children = menu.children;
        for (let j = 0; j < children.length; j++) {
          const cMenu = children[j];
          if (cMenu.key === pathname){
            return {
             title: cMenu.title
            }
          }
        }
      } else{
        //一级菜单
        if (menu.key === pathname){
          return {
            title: menu.title
          }
        }
      }
    }
    return {
      title: "首页"
    }
  }

  componentDidMount(){
    //设置计时器，请求时间
    this.timer = setInterval(()=>{
      this.setState({
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
    },1000)

    //发送请求，获取天气
    reqWeather('深圳')
      .then((response)=>{
        //请求成功的回调
        this.setState(response);
      })
      .catch((err)=>{
        //请求失败的回调
        console.log(err)
      })
  }

  componentWillUnmount=()=>{
    clearInterval(this.timer);
  }


  //点击退出按钮触发事件
  logout=()=>{
    //对话框
    Modal.confirm({
      title: '您确认要推出登录吗?',
      okText:'确认',
      cancelText:'取消',
      onOk:()=> {
        //点击确认按钮的触发事件
        //确认取消时清空内存和本地的用户信息
        removeItem();
        data.user={};
        //跳转到登录页面
        this.props.history.replace('/login');
      },
      /*onCancel() {
      //点击取消时触发的事件
        console.log("取消");
      },*/
    })
  }

  render() {
    const {time,weather,dayPictureUrl,title} = this.state;
    return <div className="header-main">
      <div className="header-main-top">
        <span>欢迎，{data.user.username}</span>
        <Button type="link" onClick={this.logout}>退出</Button>
      </div>
      <div className="header-main-bottom">
        <h3>{title}管理</h3>
        <div>
          <span>{time}</span>
          <img src={dayPictureUrl} alt="weather"/>
          <span>{weather}</span>
        </div>
      </div>

    </div>;
  }
}

export default withRouter(HeaderMain);
