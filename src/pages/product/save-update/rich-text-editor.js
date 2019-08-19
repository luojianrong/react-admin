/*
import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


export default class RichTextEditor  extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  nEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    // 子组件通知父组件值发生了变化
    /!*const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.editorChange(text);*!/
  };


  render() {
    const {editorState} = this.state;
    return <Editor
      editorState={editorState}
      editorClassName="product-editor"
      onEditorStateChange={this.onEditorStateChange}
    />;
  }
}
*/


import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState,convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './index.less';


export default  class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  static propTypes={
    getEditorVale:PropTypes.func.isRequired
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.getEditorVale(text);
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorClassName="product-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}


