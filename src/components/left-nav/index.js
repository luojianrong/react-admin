import React, { Component } from 'react';
import {Icon, Menu} from "antd";
import {withRouter,Link} from 'react-router-dom';
import {menuList} from '../../config';
import data from '../../utils/store';

const { SubMenu } = Menu;

class LeftNav extends Component {
  constructor(props){
    super(props);

    this.state = {
      selectKey:''
    }

    //获取当前页面的url
    let {pathname} = props.location;

    if (pathname.startsWith('/product')){
      pathname = '/product'
    }

    //获取内存中用户的权限菜单
    const roleMenus = data.user.role.menus;
    //进行过滤，生成权限菜单
    const menus = this.filterMenu(menuList,roleMenus);

    //侧边栏只需要创建一次，传入url
    this.menuss= this.createMenu(pathname,menus);
  }

  //根据权限菜单精心过滤
  filterMenu = (menuList, roleMenus) => {
    return menuList.reduce((prev, curr) => {
      if (roleMenus.includes(curr.key)) {
        prev.push(curr);
      } else {
        // 一级菜单没有配置上，看是否有二级菜单
        if (curr.children) {
          const cMenus = curr.children.filter((cMenu) => roleMenus.includes(cMenu.key));
          if (cMenus.length) {
            // 可能子菜单有三个，但是添加1个
            curr.children = cMenus;
            prev.push(curr);
          }
        }
      }
      return prev;
    }, []);
  };



  static getDerivedStateFromProps(nextState){
    let path = nextState.location.pathname;
    if (path.startsWith('/product')){
      path = '/product'
    }
    return {
      selectKey:path
    }
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

  createMenu=(path,menus)=>{
   return menus.map((menu)=> {
      if (menu.children){
        //如果有则是二级菜单
        return (
          <SubMenu key={menu.key} title={ <span> <Icon type={menu.icon} /><span>商品</span></span> } >
            {
              menu.children.map((item)=>{
                //当前页面url是二级路由时，展开一级菜单
                if (path === item.key){
                  this.openKey = menu.key;
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
    return  <Menu theme="dark" selectedKeys={[this.state.selectKey]}  defaultOpenKeys={[this.openKey]} mode="inline">
      {
        this.menuss
      }
    </Menu>
  }
};

export default withRouter(LeftNav);
