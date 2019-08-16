import React, { Component,Fragment } from 'react';
import  {Button,Card,Table,Icon,Modal,Form,Input,Select,message} from 'antd';
import "./index.less";
import {getCategory,addCategoryFrom} from '../../api';

import AddCategory from './add-category-form';

export default class Category extends Component {

  addCategoryRef = React.createRef();

  state = {
    isShowForm:false,
    categories:[]
  }

  showCategory=()=>{
    this.setState({
      isShowForm:true
    })

  }

  addCategory=()=>{
    this.addCategoryRef.current.validateFields((err, values) => {
      if (!err){
        const {categoryName,parentId} = values;
        addCategoryFrom(categoryName,parentId)
          .then((res)=>{
            this.setState({
              isShowForm:false,
              categories:[...this.state.categories,res]
            })
          })
          .catch((err)=>{
            message.error(err)
          })
      }
    })
  }


  handleOk=()=>{
    this.setState({
      isShowForm:false
    })
  }

  handleCancel=()=>{
    this.setState({
      isShowForm:false
    })
  }

  componentDidMount=()=>{
    getCategory(0)
      .then((res)=>{
        this.setState({
          categories:res
        })
       // console.log(res)
      })
      .catch((err)=>{
        message.error(err)
      })
  }
  //显示的列数
  columns = [
    {
      title: '品类名称',
      dataIndex: "name",
    },
    {
      title: '操作',
      className:"column-operation",   //类名
      render:()=>{   //默认返回的是普通文本，通过render可以返回特定功能的文本
        return  <Fragment>
          <Button type="link">修改名称</Button>
          <Button type="link">查看其子类</Button>
        </Fragment>
      }
    }
  ];


  render() {

    /*
       //每一行的数据
       const data = [
         {
           _id: '1',  //唯一的值
           categoryName: '手机1111' //显示的列的内容，与columns中同名属性对应
         },
         {
           _id: '2',
           categoryName: '手机2222'
         },
         {
           _id: '3',
           categoryName: '手机3333'
         },
         {
           _id: '4',
           categoryName: '手机4444'
         },
       ];
   */
    const {isShowForm,categories} = this.state;

    return <Card title="一级分类列表" extra={<Button type="primary" onClick={this.showCategory}><Icon type="plus"/> 添加品类</Button>}>
      <Table
        bordered  //是否有边框
        dataSource={categories} //显示的数据，有多少个对象就多少行
        columns={this.columns}  //表格的显示配置，与定义的columns对应
        pagination={{
          showSizeChanger:true,  //是否显示每页可以显示多少条数据
          defaultPageSize:3,  //默认选中显示多少条数据
          pageSizeOptions:['3','6','9','12'],  //可以选择显示的页数
          showQuickJumper:true  //是否显示可以跳转到第几页
        }}
        rowKey="_id"
      />

      <Modal
        visible={isShowForm}
        title="添加分类"
        onOk={this.addCategory}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <AddCategory categories={categories} ref={this.addCategoryRef}/>
      </Modal>
    </Card>
  }
};

