
import React, { Component ,Fragment} from 'react';
import {Card,Table,Input,Icon,Button,Select,message} from 'antd';
import './index.less'
import {reqProducts,reqSearch} from '../../../api';

const {Option} = Select;
export default class Index extends Component {
  state={
    products:[],  //产品列表
    total:0,  //页码总数
    pageNum:1,  //请求页数
    pageSize:3,  //请求页显示数量
    searchKey:'productName',  //搜索的类型，默认为根据产品名称搜索
    searchValue:"",  //搜索的关键字
    isSearch:false  //s是否是点击搜索按钮搜索
  }
  componentDidMount(){
    //初次获取一页的数据
    this.getProduct(1,3);
  }

  //封装获取产品的方法
  getProduct = (pageNum,pageSize) =>{
    //当是点击搜索按钮，且有值的时候，按照原来的值进行搜索
    const {isSearch,searchValue} = this.state;
    if (isSearch && searchValue){
      this.setState({
        pageNum,
        pageSize
      },()=>{
        //只有原生的事件和计时器的状态更新是同步的
        //当状态更新时就调用该方法，保证每次获取的是最新的数据
        this.search();
      })
    }else{
      //否则获取所有的数据
      reqProducts(pageNum,pageSize)
        .then((res)=>{
          message.success("获取数据成功")
          this.setState({
            products:res.list,
            total:res.total
          })
        })
        .catch((err)=>{
          message.error("获取数据失败")
        })
    }
  }

  //初始化搜索值
  searchValue = '';
  //关键字搜索事件
  search = (e)=>{
    let {pageNum,pageSize,searchKey,searchValue,total,isSearch} = this.state;

    //d当e的类型是对象想，表示是点击搜索按钮搜索的，默认请求第一页的数据，否则为点击页码搜索，根据页码的数量进行搜索
    pageNum = typeof e === 'object' ? 1: pageNum ;

    //判断事件对象，保存当前的搜索值
    if (typeof e === 'object'){
      this.searchValue = searchValue;
    }
    //请求
    reqSearch({
      [searchKey]: this.searchValue,
      pageNum,
      pageSize
    })
      .then((res)=>{
        this.setState({
          options:res.list,
          total:res.total,
          pageNum,
          pageSize,
          isSearch:true
        })
      })
      .catch((err)=>{
        message.error("搜索失败");
      })
  }



  //添加商品事件
  addProduct =()=>{
    //跳转到saveupdate页面
    this.props.history.push('/product/saveupdate');
  }

  //修改产品信息
  updateProduct = (product) =>{
    return ()=>{
      this.props.history.push('/product/saveupdate',product);
    }
  }

  //input的value值需要之间对象获取，而select的value直接可以获取到
  handleSearch=(key)=>{
    return (e)=>{
      this.setState({
        [key]: typeof e === 'string' ? e : e.target.value
      })
    }
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
          <Button type="link" onClick={this.updateProduct(product)}>修改</Button>
        </Fragment>
      }
    }
  ]
  render() {
    const {products,total,pageNum,pageSize} = this.state;
    return <Card title={
      <Fragment>
        <Select defaultValue='productName' onChange={this.handleSearch("searchKey")}>
          <Option key="productName">根据商品名称</Option>
          <Option key="productDesc">根据商品描述</Option>
        </Select>
        <Input  className="product-input" onChange={this.handleSearch("searchValue")}/>
        <Button type="primary" onClick={this.search}>搜索</Button>
      </Fragment>
    } extra={<Button type="primary" onClick={this.addProduct}><Icon type="plus"/>添加产品</Button>}>
      <Table
        bordered  //是否有边框
        dataSource={products} //显示的数据，有多少个对象就多少行
        columns={this.columns}  //表格的显示配置，与定义的columns对应
        pagination={{
          showSizeChanger:true,  //是否显示每页可以显示多少条数据
          defaultPageSize:3,  //默认选中显示多少条数据
          pageSizeOptions:['3','6','9','12'],  //可以选择显示的页数
          showQuickJumper:true,  //是否显示可以跳转到第几页
          total , //数据的总页码数,
          onChange:this.getProduct , //页码发生改变时触发的事件,会自动传入页码数和数据的大小
          onShowSizeChange:this.getProduct,
          pageSize,
          current:pageNum
        }}
        rowKey="_id">

      </Table>
    </Card>;
  }
}
