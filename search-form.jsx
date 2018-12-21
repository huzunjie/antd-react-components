import React from 'react';
import { Form, Button, Input, Radio, Select } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class SearchForm extends React.Component {

  onSubmit = (e) => {
    e.preventDefault();
    const {form, onSubmit} = this.props;
    const vals = form.getFieldsValue();
    //console.log('SearchForm Values:', vals);
    onSubmit && onSubmit(vals);
  }

  render() {

    const { form, items=[], style={}, hideSearchButton=false, children } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" onSubmit={this.onSubmit} style={style} className="search-form">

        {items.map(
          ({label, name, type, value, options, placeholder, style, onChange, className, ipt_style, dropdownMatchSelectWidth}, item_i)=>{
            const item_key = '_s_f_'+item_i;
            const ipt_attrs = { placeholder, onChange, style:ipt_style, dropdownMatchSelectWidth };
            const item_attrs = { label, style, className /*className='ant-form-item-addon'设置label与表单为组*/ };
            return (
              <FormItem {...item_attrs} key={item_key}>
                {getFieldDecorator(name, {
                  initialValue: value
                })(
                  type=='Radios'?(
                    <RadioGroup {...ipt_attrs} options={options}/>
                  ) : type=='RadioButtons'?(
                    <RadioGroup {...ipt_attrs} title={placeholder}>
                      {options.map(({value, label, attrs={}}, opt_i)=><RadioButton key={item_key+'_'+opt_i} value={value} {...attrs}>{label}</RadioButton>)}
                    </RadioGroup>
                  ) : type=='Select'?(
                    <Select {...ipt_attrs}>
                      {options.map(({value, label, attrs={}}, opt_i)=><Option key={item_key+'_'+opt_i} value={value} {...attrs}>{label}</Option>)}
                    </Select>
                  ) : (
                    <Input {...ipt_attrs} />
                  )
                )}
              </FormItem>
            );
          }
        )}

        {!hideSearchButton && <FormItem>
          <Button type="primary" htmlType="submit" icon="search">
            搜索
          </Button>
        </FormItem>}

        {children&&<FormItem>{children}</FormItem>}

      </Form>
    );
  }
}

export default Form.create()(SearchForm);










