
import React, { Component ,Fragment} from 'react';
import {Card,Table,Input,Icon,Button,Select,message} from 'antd';
import './index.less'
import {getProducts} from '../../../api';

const {Option} = Select;
export default class Index extends Component {
  state={
    products:[]
  }

  componentDidMount(){
    getProducts(1,3)
      .then((res)=>{
        message.success("获取数据成功")
        this.setState({
          products:res.list
        })
      })
      .catch((err)=>{
        message.error("获取数据失败")
      })
  }

  //添加商品事件
  addProduct =()=>{

  }

  columns=[
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (text) => `￥${text}`
    },
    {
      title: '状态', // 列的标题
      render: (product) => {
        return <Fragment>
          <Button type="primary">上架</Button>
          &nbsp;&nbsp;&nbsp;已下架
        </Fragment>
      }
    },
    {
      title: '操作', // 列的标题
      render: (product) => {
        return <Fragment>
          <Button type="link">详情</Button>
          <Button type="link">修改</Button>
        </Fragment>
      }
    }
  ]
  render() {
    const {products} = this.state;
    return <Card title={
      <Fragment>
        <Select defaultValue='1'>
          <Option key="1">根据商品名称</Option>
          <Option key="2">根据商品描述</Option>
        </Select>
        <Input  className="product-input"/>
        <Button type="primary">搜索</Button>
      </Fragment>
    } extra={<Button type="primary"><Icon type="plus" onClick={this.addProduct}/>添加产品</Button>}>
      <Table
        bordered  //是否有边框
        dataSource={products} //显示的数据，有多少个对象就多少行
        columns={this.columns}  //表格的显示配置，与定义的columns对应
        pagination={{
          showSizeChanger:true,  //是否显示每页可以显示多少条数据
          defaultPageSize:3,  //默认选中显示多少条数据
          pageSizeOptions:['3','6','9','12'],  //可以选择显示的页数
          showQuickJumper:true  //是否显示可以跳转到第几页
        }}
        rowKey="_id">

      </Table>
    </Card>;
  }
}
