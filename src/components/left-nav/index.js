import React, { Component } from 'react';
import {menuList} from '../../config';
import {Icon, Menu} from "antd";
import {withRouter,Link} from 'react-router-dom';   //withRouter

const { SubMenu } = Menu;

class LeftNav extends Component {
  constructor(props){
    super(props);

    this.pathnames = props.location.pathname;
    this.menus= this.createMenu(this.pathnames);
  }


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
    return  <Menu theme="dark" defaultSelectedKeys={[this.pathnames]}  defaultOpenKeys={[this.seletName]} mode="inline">
      {
        this.menus
      }
    </Menu>
  }
};

export default withRouter(LeftNav);
