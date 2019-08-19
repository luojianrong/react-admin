
import React, { Component ,Fragment} from 'react';
import {Card,Icon,Input,InputNumber,Cascader,Form,Button,message} from 'antd';
import {getCategory} from '../../../api';

const {Item} = Form;
class SaveUpdate extends Component {
  state={
    options:[]
  }
  //表单提交事件
  submit = (e)=>{
    e.preventDefault();
  }
  onChange = ()=>{

  }

  componentDidMount(){
    //请求一级菜单
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
      })
  }

  //子菜单数据加载事件
  loaData=(selectOptions)=>{
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
    const {getFieldDecorator} = this.props.form;
    const {options} = this.state;
    return <Card title={<Fragment><Icon type="arrow-left"/>&nbsp;&nbsp;添加商品</Fragment>}>
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
                ]
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
                ]
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
                ]
              }
            )(
              <Cascader
                options={options}
                loadData={this.loaData}
              />
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator(
              "id",
              {
                rules:[
                  {
                    required:true,message:"输入内容不能为空"
                  }
                ]
              }
            )(
              <InputNumber  onChange={this.onChange}
                            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                            className="save-update-input"/>
            )
          }
        </Item>
        <Item label="商品详情">
          <Input/>
        </Item>
        <Item>
          <Button type="primary" htmlType="submit" className="save-update-btn">提交</Button>
        </Item>

      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate)
