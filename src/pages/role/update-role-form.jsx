import React, { Component } from 'react';
import { Form, Input, Tree } from 'antd';
import {menuList} from '../../config';
import PropType from 'prop-types';

const Item = Form.Item;
const { TreeNode } = Tree;

class UpdateRoleForm extends Component {
  static propType = {
    name: PropType.string.isRequired
  }

  //创建Tree组件渲染的数据
  treeData = [{title:"平台权限",key:'/',children:menuList.map((menu)=>{
      const data = {
        title: menu.title,
        key: menu.key
      };
      if (menu.children){
        data.children = menu.children.map((cMenu)=>{
          return {
            title: cMenu.title,
            key: cMenu.key
          }
        })
      }
      return data;
    })}
  ];



  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };


  //渲染Tree组件
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });

  render () {

    const { form:{ getFieldDecorator } ,name } = this.props;

    return (
      <Form>
        <Item label='角色名称'>
          {
            getFieldDecorator(
              'name',
              {initialValue:name}
            )(
              <Input placeholder="请输入角色名称" disabled/>
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator(
              "menus",
              {
                rules:[
                  {required:true, message:"角色权限不能为空"}
                ],
                valuePropName: 'checkedKeys', // 子节点的值的属性
                trigger: 'onCheck', // 收集子节点的值的时机
                validateTrigger: 'onCheck' // 校验子节点值的时机
              }
            )(
              <Tree
                checkable
                defaultExpandAll={true}  //默认展开所有的Tree
                //onCheck={this.onCheck}
              >
                {this.renderTreeNodes(this.treeData)}
              </Tree>)
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateRoleForm);
