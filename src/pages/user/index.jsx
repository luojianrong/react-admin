import React, { Component } from 'react';
import { Card, Button, Table, Modal ,message} from 'antd';
import dayjs from "dayjs";
import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import RemoveUser from './remove-user-from';
import  {reqGetUser,reqAddUser,reqRoles,reqRemoveUser} from '../../api';

export default class User extends Component {
  state = {
    users: [], //用户数组
    roles:[],
    user:[],
    isShowAddUserModal: false, //是否展示创建用户的标识
    isShowUpdateUserModal: false, //是否展示更新用户的标识
    isShowRemoveUserModal:false   //是否展示删除用户界面
  };

  addUserFormRef = React.createRef();
  updateUserFormRef = React.createRef();
  removeUserFormRef = React.createRef();

  componentDidMount(){
    //获取用户列表
    reqGetUser()
      .then((res)=>{
        message.success("获取用户列表成功")
        this.setState({
          users:res.users
        })
      })
      .catch((err)=>{
        message.error("获取用户列表失败")
      })

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

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (id) => {
        const role = this.state.roles.find((role) => role._id === id);
        return role ? role.name : '';
      }
    },
    {
      title: '操作',
      render: user => {
        return <div>
          <Button type="link" onClick={() => {}}>修改</Button>
          <Button type="link" onClick={this.deleteUser(user)}>删除</Button>
        </div>
      }
    }
  ];

  //创建用户的回调函数
  addUser = () => {
    this.addUserFormRef.current.validateFields((err,values)=>{
      const {username,password,phone,email,role_id}  = values;
      if (!err){
        reqAddUser({username,password,phone,email,role_id})
          .then((res)=>{
            message.success("创建用户成功");
            this.setState({
              users:[...this.state.users,res]
            })
          })
          .catch((err)=>{
            message.error("创建用户失败")
          })
          .finally(()=>{
            this.setState({
              isShowAddUserModal:false
            });
            this.addUserFormRef.current.resetFields();
          })
      }
    })
  };

  updateUser = () => {

  };

  switchModal = (key, value) => {
    return () => {
      this.setState({
        [key]: value
      })
    }
  };

  //点击删除用户按钮
  deleteUser = (user)=>{
    console.log(user);
    return ()=>{
      this.setState({
        isShowRemoveUserModal:true,
        user
      })
    }
  }

  //确认删除用户
  removeUser = () =>{
    this.removeUserFormRef.current.validateFields((err,values)=>{
      const {userId} = values;
      console.log(values);
      if (!err){
        reqRemoveUser(userId)
          .then((res)=>{
            message.success("删除用户成功")
            this.setState({
              users:this.state.users.filter(user=> user._id !== userId)
            })
          })
          .catch(()=>{
            message.error("删除用户失败")
          })
          .finally(()=>{
            this.setState({
              isShowRemoveUserModal:false,
            })
          })
      }
    })
  }

  render () {
    const { users, roles,isShowAddUserModal, isShowUpdateUserModal ,isShowRemoveUserModal,user} = this.state;
    return (
      <Card
        title={
          <Button type='primary' onClick={this.switchModal('isShowAddUserModal', true)}>创建用户</Button>
        }
      >
        <Table
          columns={this.columns}
          dataSource={users}
          bordered
          rowKey='_id'
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            showQuickJumper: true,
          }}
        />

        <Modal
          title="创建用户"
          visible={isShowAddUserModal}
          onOk={this.addUser}
          onCancel={this.switchModal('isShowAddUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddUserForm ref={this.addUserFormRef} roles={roles}/>
        </Modal>

        <Modal
          title="更新用户"
          visible={isShowUpdateUserModal}
          onOk={this.updateUser}
          onCancel={this.switchModal('isShowUpdateUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateUserForm ref={this.updateUserFormRef}/>
        </Modal>

        <Modal
          title="删除用户"
          visible={isShowRemoveUserModal}
          onOk={this.removeUser}
          onCancel={this.switchModal('isShowRemoveUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <RemoveUser ref={this.removeUserFormRef} user={user}/>
        </Modal>

      </Card>
    )
  }
}
