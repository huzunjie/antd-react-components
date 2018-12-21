import React from 'react';
import $ from 'jQuery';
import { Modal, Form, Button, Input, Select, InputNumber, Icon, message, Radio, TreeSelect } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const TextArea = Input.TextArea;

import {fil_fun} from './form-item-layout.jsx';

class ModalForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    const {visible:nextVisible} = nextProps;
    const {visible:currVisible, form} = this.props;
    // 模态框打开时，设置表单状态
    if(currVisible!==nextVisible && nextVisible){
      form.resetFields();
    }
    return true;
  }

  onSave(){
    const _this = this;
    const { url, method='POST', title, form, onSaveSuccess, onCancel, items } = _this.props;

    // 校验通过则允许提交
    form.validateFields((err, data) => {
      if (!err) {

        // 每个字段可以通过parse属性设置自定义格式化方法会
        const val2send = {};
        (items||[]).forEach(({ parse, name })=>{
          parse && name && (val2send[name]=parse);
        });

        // 将JSON序列化为字符串
        $.each(data, (_key, _val)=>{
          if(val2send[_key]){
            _val = data[_key] = val2send[_key](_val);
          }
          if($.isArray(_val) || $.isPlainObject(_val)){
            data[_key] = JSON.stringify(_val);
          }
        });
        // console.log('onSave send before:', data);

        _this.setState({ loading:true });
        $.ajax({
          type: method,
          url, 
          data, 
          complete(){
            _this.setState({ loading:false });
          },
          success(res){
            res = res || {};
            if(res.errno==0){
              message.success(title+'保存成功。');
              onCancel && onCancel();
              onSaveSuccess && onSaveSuccess(res);
            }else{
              message.error(title+'保存失败：'+(res.errmsg||'未知的服务端异常'));
            }
          },
          error(){
            message.error(title+'保存失败：网络或服务端异常。');
          },
          dataType:'json'
        });
      }
    });
  }
  renderTreeNode(tree_data, children_key='children', value_key='value', label_key='label', icon_key='icon', _parent_key=''){
    const _this = this;
    return (tree_data||[]).map((item, _i)=>{
      const children = item[children_key];
      const icon = item[icon_key];
      const _key = _parent_key+'_'+_i;
      return (
        <TreeNode 
          key={_key} 
          value={item[value_key]} 
          title={<span>{icon&&<Icon type={icon} />} {item[label_key]}</span>} 
        >
          {children && _this.renderTreeNode(children, children_key, value_key, label_key, icon_key, _key)}
        </TreeNode>
      );
    });
  }
  renderFormItems(items, getFieldDecorator, _parent_key=''){
    const _this = this;
    const {l_span=5, w_span=18} = _this.props;
    return (items||[]).map((item, item_i)=>{
      const {label, name, type, value, options, placeholder, min, max, rows, required, style, disabled, isHidden, onChange, className, rules=[]} = item;

      const item_key = _parent_key+'_mfi_'+item_i;
      if(type=='group'){
        return _this.renderFormItems(item.items, getFieldDecorator, item_key);
      }

      if(type=='sub-title'){
        return <h2 key={item_key} className="sub-title">{value}</h2>;
      }
      
      const ipt_attrs = { placeholder, onChange, min, max, rows };
      const item_attrs = { label, style, className };
      if(type=='hidden'||isHidden){
        item_attrs.style = Object.assign(item_attrs.style||{}, { display:'none' });
      }
      if(disabled){
        ipt_attrs.disabled = true;
      }
      const initialValue = type=='Number'?( Number(value)||0 ): (value===0?'0':(value||''));
      if(!name){
        console.error('缺少必要属性[name]:', );
        return '<span>缺少必要属性[name]</span>';
      }

      const formItemLayout = fil_fun(l_span, w_span);

      return (
        <FormItem key={item_key} {...formItemLayout} {...item_attrs}>
          {getFieldDecorator(name, {
            initialValue,
            rules: [
              ...rules, 
              ...(
                required?[
                  {required: true, message: '请'+( /(Radios|Select|MultTree)/.test(type)?'选择':'输入')+label}
                ]:[]
              )
            ]
          })(

            type=='MultTree'?(
              <TreeSelect  {...ipt_attrs}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                allowClear
                multiple
                treeDefaultExpandAll
                showCheckedStrategy={TreeSelect.SHOW_ALL}
              >
                {_this.renderTreeNode(item.tree_data, item.children_key, item.value_key, item.label_key, item.icon_key, name)}
              </TreeSelect>
            ) : type=='Custom'?(
              item.render && item.render()
            ) : type=='Radios'?(
              <RadioGroup {...ipt_attrs} options={options}/>
            ) : type=='Select'?(
              <Select {...ipt_attrs}>
                {options.map(({value, label, attrs={}}, opt_i)=><Option key={item_key+'_'+opt_i} value={value} {...attrs}>{label}</Option>)}
              </Select>
            ) : type=='Number'?(
              <InputNumber {...ipt_attrs} />
            ) : type=='TextArea'?(
              <TextArea {...ipt_attrs} />
            ) : (
              <Input {...ipt_attrs} />
            )
          )}
          {item.children}
        </FormItem>
      );
    });
  }

  render() {
    const _this = this;
    const { icon, title, visible, width, cancelText='取消', okText='确定保存', items, onCancel, form } = _this.props;
    const { getFieldDecorator } = form;
    const { loading } = _this.state;

    return (
      <Modal
        title={<span>{icon&&<Icon type={icon} />} {title}</span>}
        visible={visible}
        onCancel={()=>onCancel()}
        width={width||650}
        maskClosable={false}
        footer={<div>
          <Button onClick={()=>onCancel()}>
            {cancelText}
          </Button>
          <Button type="primary" loading={loading} onClick={()=>_this.onSave()}>
            {okText}
          </Button>
        </div>}
      >
        <Form>
          {_this.renderFormItems(items, getFieldDecorator)}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModalForm);




