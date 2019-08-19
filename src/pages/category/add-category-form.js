import React, { Component } from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from 'prop-types'

const {Item} = Form;
const {Option} = Select;

class AddCategory  extends Component {
static propTypes ={
  categories:PropTypes.array.isRequired
}


  render() {
    const {categories} = this.props;
    const {getFieldDecorator} = this.props.form;

    return  <Form>
      <Item label="所属分类">
        {
          getFieldDecorator(
            "parentId",
            {
              initialValue:"0"
            }
          )(
            <Select>
            <Option key="0" value="0">一级分类</Option>
            {
              categories.map((category)=> <Option key={category._id}>{category.name}</Option> )
            }
            </Select>
          )
        }
      </Item>
      <Item label="分类名称">
        {
          getFieldDecorator(
            "categoryName",
            {
              rules:[
                {required:true,message:"请输入分类名称"}
              ]
            }
          )(<Input/>)
        }
      </Item>
    </Form>
  }
};

export default Form.create()(AddCategory)
