import React, { Component,Fragment } from 'react';
import  {Button,Card,Table,Icon,Modal,message} from 'antd';
import "./index.less";
import {getCategory,addCategoryFrom,updateCategoryNameFrom} from '../../api';

import AddCategory from './add-category-form';
import UpdateCategoryName from './update-categoryName-form'

export default class Category extends Component {

  addCategoryRef = React.createRef();
  updateCategoryNameRef = React.createRef();

  state = {
    categories:[], //一级分类数据
    subCategories:[], //二级分类数据
    category:{}, //保存在闭包中的每一个数据
    isShowForm:false,  //控制是否显示添加分类的对话框
    isShowSubCategory:false, //控制是否显示二级分类对话框
    isCategoryName:false,  //控制修改分类名称的对话框显示
  }

  //控制显示添加分类对话框
  showCategory=()=>{
    this.setState({
      isShowForm:true
    })

  }

  //添加分类事件
  addCategory=()=>{
    this.addCategoryRef.current.validateFields((err, values) => {
      if (!err){
        const {categoryName,parentId} = values;
        //发送请添加数据
        addCategoryFrom(categoryName,parentId)
          .then((res)=>{
            //判断需要展示的数据是一级分类还是二级分类
            const {isShowSubCategory,category} = this.state;
           // const isSubCategories = +parentId !==0;

            const key = isShowSubCategory?'subCategories':'categories';
            if (isShowSubCategory && parentId !== category._id) {
              //在二级分类中添加二级分类，不需要更新二级菜单
              return;
            }
            //请求成功更新数据
            this.setState({
              [key]:[...this.state[key],res]
            })
          })
          .catch((err)=>{
            //请求失败提示错误
            message.error(err)
          })
          .finally(()=>{
            //成功或失败都隐藏对话框，
            this.setState({
              isShowForm:false,
            });
            //并清空表单数据
            this.addCategoryRef.current.resetFields();
          })
      }
    })
  }

  //点击修改分类事件
  showUpdateForm =(category)=>{
    return ()=>{
      this.setState({
        isCategoryName:true,
        category
      })
    }
  }

  //修改确认事件
  updateCategoryName =()=>{
    this.updateCategoryNameRef.current.validateFields((err,values)=>{
      const {categoryName} = values;
      const  categoryId = this.state.category._id;
      if (!err){
        updateCategoryNameFrom(categoryId,categoryName)
          .then((res)=>{
            message.success("更新状态成功");
            const key = this.state.isShowSubCategory?'subCategories':'categories'
            this.setState({
              [key]:this.state[key].map((item)=>{
                if (item._id === categoryId) {
                  item.name = categoryName
                }
                  return item
              })
            })
          })
          .catch((err)=>{
            message.error("更新状态失败",err)
          })
          .finally(()=>{
            this.setState({
              isCategoryName:false
            })
            this.updateCategoryNameRef.current.resetFields();
          })
      }
    })
  }

  //查看子品类事件
  showSubCategory=(category)=>{
    return ()=>{
      getCategory(category._id)
        .then((res)=>{

          this.setState({
            isShowSubCategory:true,
            subCategories:res,
            category
          })

        })
        .catch(()=>{

        })
    }
  }

  //返回一级菜单的事件
  backCategory =()=>{
    this.setState({
      isShowSubCategory:false
    })
  }

  //弹框取消的触发事件
  cancel=(key)=>{

   return ()=>{
     this.setState({
       [key]:false
     })
   }

  }

  //组件渲染完成
  componentDidMount=()=>{
    //发送请求获取所有的一级分类
    getCategory(0)
      .then((res)=>{
        //成功则更新状态，实现动态显示数据
        this.setState({
          categories:res
        })
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
      //dataIndex:"_id",
      className:"column-operation",   //类名
      render:(category)=>{   //与dataIndex传入的属性值对应，如果没有定义，则默认传整个对象
        return  <Fragment>
          <Button type="link" onClick={this.showUpdateForm(category)}>修改名称</Button>
          {
            this.state.isShowSubCategory?null: <Button type="link" onClick={this.showSubCategory(category)}>查看其子类</Button>
          }
        </Fragment>
      }
    }
  ];


  render() {
    const {isShowForm,categories,subCategories,isShowSubCategory,category,isCategoryName} = this.state;

    return <Card title={ isShowSubCategory? <Fragment>
      <Button type="link" className="category-btn" onClick={this.backCategory}>一级分类</Button>
      <Icon type="arrow-right"/>
      <span className="category-text">{category.name}</span>
    </Fragment>:"一级分类列表" } extra={<Button type="primary" onClick={this.showCategory}><Icon type="plus"/> 添加品类</Button>}>
      <Table
        bordered  //是否有边框
        dataSource={isShowSubCategory? subCategories:categories} //显示的数据，有多少个对象就多少行
        columns={this.columns}  //表格的显示配置，与定义的columns对应
        pagination={{
          showSizeChanger:true,  //是否显示每页可以显示多少条数据
          defaultPageSize:3,  //默认选中显示多少条数据
          pageSizeOptions:['3','6','9','12'],  //可以选择显示的页数
          showQuickJumper:true  //是否显示可以跳转到第几页
        }}
        rowKey="_id"
      />
      {/*添加分类对话框*/}
      <Modal
        visible={isShowForm}
        title="添加分类"
        onOk={this.addCategory}
        onCancel={this.cancel("isShowForm")}
        okText="确认"
        cancelText="取消"
      >
        <AddCategory categories={categories} ref={this.addCategoryRef}/>
      </Modal>

      {/*修改分类名称对话框*/}
      <Modal
        visible={isCategoryName}
        title="更新分类"
        onOk={this.updateCategoryName}
        onCancel={this.cancel("isCategoryName")}
        okText="确认"
        cancelText="取消"
        width={300}
      >
        <UpdateCategoryName category={category} ref={this.updateCategoryNameRef} />
      </Modal>
    </Card>
  }
};

