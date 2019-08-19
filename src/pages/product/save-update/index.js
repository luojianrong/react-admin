
import React, { Component ,Fragment} from 'react';
import {Card,Icon,Input,InputNumber,Cascader,Form,Button,message} from 'antd';
import {getCategory,addProduct} from '../../../api';
import RichTextEditor from './rich-text-editor';

const {Item} = Form;
class SaveUpdate extends Component {
  state={
    options:[],
    id:[]
  }

  //组件渲染完成时发送请求
  componentDidMount(){
    //将所有的请求放在一起发送
    let promiseArr = [];

    promiseArr.push(getCategory(0));

    const {state} = this.props.location;
    if (state){
      //当拥有state属性时，证明是更新产品信息
      //当pCategoryId为0时，证明更新的是一级分类
      if (+state.pCategoryId === 0){
        this.setState({
          id:[state.pCategoryId]
        })
      }else {
        //否则更新的是二级分类，需要发送请求
        promiseArr.push(getCategory(state.pCategoryId));
      }
    }

    //所有的请求都才成功时触发事件
    Promise.all(promiseArr)
      .then((res)=>{
        //数组的解构赋值，按照下标的位置
        const [categories, subCategories] = res;
        console.log(categories,subCategories)
        this.setState({
          options:categories.map((category)=>{
            const option = {
              label:category.name,
              value:category._id,
              isLeaf:false
            };
            //判断是否有二级分类，且是否是该一级分类的二级分类
            if (subCategories && category._id === state.pCategoryId ) {
              //是，则添加到该一级分类的children属性
              option.children= subCategories.map((subCategory)=>{
               return  {
                  label:subCategory.name,
                  value:subCategory._id
                }
              })
            }
            return option;
          }),
          id: subCategories? [state.pCategoryId,state.categoryId]:this.state.id
        });
      })
      .catch((err)=>{
        message.error("请求二级数据失败")
      })

    /*    //请求一级菜单
        getCategory(0)
          .then((res)=>{
            message.success("请求数据成功");
            this.setState({
              options:res.map((category)=> {
                return{
                  label:category.name,
                  value:category._id,
                  isLeaf:false  //添加该属性才能加载二级菜单
                }
              })
            })
          })
          .catch((err)=>{
            message.error("请求数据失败")
          })*/
  }


  //表单提交事件
  submit = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err,values)=>{
        console.log(values);
        if (!err){
        //id是一个数组
        const { name, desc, price, id, detail } = values;
        let categoryId,pCategoryId;
        if (id.length===1){
          //当长度只有一个值时，表示是一级菜单
          pCategoryId = 0;
          categoryId = id[0];
        } else {
          pCategoryId = id[0];
          categoryId = id[1];
        }
        addProduct({ name, desc, price, detail, categoryId, pCategoryId })
          .then((res)=>{
            message.success("添加产品成功");
            this.props.history.push('/product/index');
          })
          .catch((err)=>{
            message.error("添加产品失败")
          })
      }
    }
    )
  }

  //自定义收集表单项的值
  getEditorVale = (text)=>{
    this.props.form.setFields({
      detail: {
        value: text
      }
    });
  }

  goBack = ()=>{
    //返回到index页面
    this.props.history.push('/product/index');
    // this.props.history.goBack();
  }


  //子菜单数据加载事件
  loadData=(selectOptions)=>{
    //找到最后一级菜单对象
    const targetOption = selectOptions[selectOptions.length-1];
    targetOption.loading = true; //设置加载图标

    //发送请求，获取二级菜单数据
    getCategory(targetOption.value)
      .then((res)=>{
        targetOption.loading = false;
        if (res.length === 0){
          targetOption.isLeaf = true;
        }else {
          targetOption.children = res.map((item)=>{
            return {
              label:item.name,
              value: item._id,
            }
          });
        }
        //更新状态，获取最新的数据
        this.setState({
          options:[...this.state.options],
        })
      })
      .catch((err)=>{
        message.error("加载数据失败")
      })
  }

  render() {
    const {form:{getFieldDecorator},location:{state}} = this.props;
    const {options,id} = this.state;
    console.log(id)
    const isUpdateProduct = !!state;
    return <Card title={<Fragment><Icon type="arrow-left" onClick={this.goBack}/>&nbsp;&nbsp;{isUpdateProduct?"修改":"添加"}商品</Fragment>}>
      <Form onSubmit={this.submit} labelCol={{span:2}} wrapperCol={{span:8}}>
        <Item label="商品名称">
          {
            getFieldDecorator(
              "name",
              {
                rules:[
                  {
                    required:true,message:"输入内容不能为空"
                  }
                ],
                initialValue:isUpdateProduct?state.name:""
              }
            )(
              <Input placeholder="请输入商品名称"/>
            )
          }
        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              "desc",
              {
                rules:[
                  {
                    required:true,message:"输入内容不能为空"
                  }
                ],
                initialValue:isUpdateProduct?state.desc:""
              }
            )(
              <Input placeholder="请输入商品描述"/>
            )
          }
        </Item>
        <Item label="选择分类">
          {
            getFieldDecorator(
              "id",
              {
                rules:[
                  {
                    required:true,message:"输入内容不能为空"
                  }
                ],
                initialValue:id
              }
            )(
              <Cascader
                options={options}
                loadData={this.loadData}
                placeholder="请选择商品分类"
              />
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator(
              "price",
              {
                rules:[
                  {
                    required:true,message:"输入内容不能为空"
                  }
                ],
                initialValue:isUpdateProduct?state.price:""
              }
            )(
              <InputNumber
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/￥\s?|(,*)/g, '')}
                className="save-update-input"
              />
            )
          }
        </Item>
        <Item label="商品详情" wrapperCol={{span:20}}>
          {
            getFieldDecorator(
              "detail",
              {
                rules:[
                  {required:true,message:"请输入商品详情"}
                ]
              }
            )(
              <RichTextEditor getEditorVale={this.getEditorVale}/>
            )
          }
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" className="save-update-btn">提交</Button>
        </Item>

      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);
