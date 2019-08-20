import React, { Component } from 'react';
import { Card, Button, Table, Radio, Modal ,message} from 'antd';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import {reqAddRole,reqUpdateRole,reqRoles}  from '../../api';
import dayjs from 'dayjs';

const RadioGroup = Radio.Group;

export default class Role extends Component {
  state = {
    value: '',  //单选的默认值，也就是选中的某个角色的id值
    roles: [], //权限数组
    isShowAddRoleModal: false, //是否展示创建角色的标识
    isShowUpdateRoleModal: false, //是否展示设置角色的标识
    isDisabled: true
  };

  addRoleFormRef = React.createRef();  //添加角色
  updateRoleFormRef = React.createRef();  //更新权限

  //设置角色列表数据
  columns = [
    {
      dataIndex: '_id',
      render: id => <Radio value={id} />
    }, {
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      render: time => dayjs(time).format("YYYY-MM-DD HH-mm-ss")
    }, {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: time => time? dayjs(time).format("YYYY-MM-DD HH-mm-ss"):''
    }, {
      title: '授权人',
      dataIndex: 'auth_name',
    }
  ];


  componentDidMount(){
    //请求角色
    reqRoles()
      .then((res)=>{
        this.setState({
          roles:res
        })
        message.success("获取角色列表成功");
      })
      .catch((err)=>{
        message.error("获取角色列表失败");
      })
  }


  //单选框按钮被选中的触发事件
  onRadioChange = (e) => {
    //e.target.value：单选框的id
    this.setState({
      value: e.target.value,
      isDisabled:false
    });
  };


  //设置权限的事件
  switchModal = (key, value) => {
    return () => {
      this.setState({[key]: value})
    }
  };



  //创建角色的回调函数
  addRole = () => {
    this.addRoleFormRef.current.validateFields((err,values)=>{
      if (!err){
        const  {name} = values;
        reqAddRole(name)
          .then((res)=>{
            this.setState({
              roles:[...this.state.roles,res]
            })
            message.success("创建角色成功");
          })
          .catch((err)=>{
            message.error("创建角色失败");
          })
          .finally(()=>{
            this.setState({
              isShowAddRoleModal:false
            })
            this.addRoleFormRef.current.resetFields();
          })
      }
    })
  };
  //设置角色权限的回调函数
  updateRole = () => {
    this.updateRoleFormRef.current.validateFields((err,values)=>{
      const {name,menus} = values;
      const _id = this.state.value;
      if (!err){
        reqUpdateRole(_id, name, menus)
          .then((res)=>{
            message.success("角色更新成功");
            this.setState({
              roles:this.state.roles.map((role)=>{
                if (role._id === _id) {
                  return res;
                }
                return role;
              })
            })
          })
          .catch((err)=>{
            message.error("角色更新失败")
          })
          .finally(()=>{
            this.setState({
              isShowUpdateRoleModal:false
            })
            this.updateRoleFormRef.current.setFields(["name"]);
          })
      }
    })
  };

  render () {
    const { roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal } = this.state;
    //遍历所有的权限用户，查找对应的id
    const role = roles.find((role)=> role._id === value);
    //先判断用户是否存在，存在则获取用户的name
    const name = role ? role.name : '';

    return (
      <Card
        title={
          <div>
            <Button type='primary' onClick={this.switchModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled} onClick={this.switchModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </div>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>

        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.addRole}
          onCancel={this.switchModal('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm ref={this.addRoleFormRef}/>
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.updateRole}
          onCancel={this.switchModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm ref={this.updateRoleFormRef} name={name}/>
        </Modal>

      </Card>
    )
  }
}
