import React, { Component } from 'react';
import { Form, Input } from 'antd';

const {Item} = Form;
class RemoveUser extends Component {
  render() {
    const {form:{getFieldDecorator},user} = this.props;
    const {_id} = user;
    return <Form>
      <Item >
        {
          getFieldDecorator(
            "userId",
            {
              initialValue:_id
            }
          )(<Input/>)
        }
      </Item>
    </Form>;
  }
}
export default  Form.create()(RemoveUser)
