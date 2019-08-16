import React, { Component } from 'react';
import {menuList} from '../../config';
import {Icon, Menu} from "antd";
import {withRouter,Link} from 'react-router-dom';   //withRouter

const { SubMenu } = Menu;

class LeftNav extends Component {
  constructor(props){
    super(props);
    //获取当前页面的url
    this.pathnames = props.location.pathname;
    //侧边栏只需要创建一次，传入url
    this.menus= this.createMenu(this.pathnames);
  }

  //生成一级路由或二级路由
  createItem=(item)=>{
    return (
      <Menu.Item key={item.key}>
        <Link to={item.key}>
          <Icon type={item.icon} />
          <span>{item.title}</span>
        </Link>
      </Menu.Item>
    )
  }

  createMenu=(path)=>{
    return menuList.map((menu)=> {
      if (menu.children){
        //如果有则是二级菜单
        return (
          <SubMenu key={menu.key} title={ <span> <Icon type={menu.icon} /><span>商品</span> </span> } >
            {
              menu.children.map((item)=>{
                //当前页面url是二级路由时，展开一级菜单
                if (path === item.key){
                  this.seletName = menu.key;
                }
                return this.createItem(item);
              })
            }
          </SubMenu>
        )
      }else{
        return this.createItem(menu);
      }
    });
  }

  render() {
    /*defaultSelectedKeys：默认选中；defaultOpenKeys：默认展开*/
    return  <Menu theme="dark" defaultSelectedKeys={[this.pathnames]}  defaultOpenKeys={[this.seletName]} mode="inline">
      {
        this.menus
      }
    </Menu>
  }
};

export default withRouter(LeftNav);
