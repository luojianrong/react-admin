import React, { Component } from 'react';
import { Form, Input } from 'antd';

const Item = Form.Item;

class AddRoleForm extends Component {

  render () {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <Item label='角色名称' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'name',
              {
                rules:[
                  {required:true,message:"角色名称不能为空"}
                ]
              }
            )(
              <Input placeholder='请输入角色名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddRoleForm);
