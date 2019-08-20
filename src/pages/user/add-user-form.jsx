import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;


class AddUserForm extends Component {
  static propTypes = {
    roles:PropTypes.array.isRequired
  }

  /*componentDidMount(){
    //请求权限角色列表
    reqRoles()
      .then((res)=>{
        message.success("获取角色列表成功");
        this.setState({
          roles:res
        })
      })
      .catch((err)=>{
        message.error("获取角色列表失败");
      })
  }*/

  render () {
    const { form:{getFieldDecorator },roles} = this.props;
    console.log(roles);
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',{
                rules:[
                  {
                    required:true,message:"用户居名更新车成功"
                  }
                ]
              }
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'password',{
                rules:[
                  {
                    required:true,message:"用户居名更新车成功"
                  }
                ]
              }
            )(
              <Input placeholder='请输入密码' type='password'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',{
                rules:[
                  {
                    required:true,message:"用户居名更新车成功"
                  }
                ]
              }
            )(
              <Input true='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',{
                rules:[
                  {
                    required:true,message:"用户居名更新车成功"
                  }
                ]
              }
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',{
                rules:[
                  {
                    required:true,message:"用户居名更新车成功"
                  }
                ]
              }
            )(
              <Select placeholder='请选择分类'>
                {
                  roles.map((role)=>{
                    return <Option value={role._id} key={role._id}>{role.name}</Option>
                  })
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUserForm);
