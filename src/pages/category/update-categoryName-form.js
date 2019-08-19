import React, {Component} from 'react';
import { Form, Input} from "antd";
import PropTypes from 'prop-types'

const {Item} = Form;

class UpdateCategoryName  extends Component {

static propTypes ={
  category:PropTypes.object.isRequired
}

  //校验表单
  validator =(relues,values,callback)=>{
    if (!values){
      callback("请输入分类名称，值不能为空")
    }else if (values === this.props.category.name){
      callback("输入名称不能相同")
    }
    callback();
  }


  render() {

    const { category:{name} , form:{getFieldDecorator} } = this.props;
    return  <Form>
      <Item>
        {
          getFieldDecorator(
            "categoryName",
            {
              initialValue:name,
              rules:[
                {validator:this.validator}
              ]
            }
          )(<Input/>)
        }
      </Item>
    </Form>
  }
};

export default Form.create()(UpdateCategoryName)
