# antd-react-components

Ant Design 通用组件

## 模态表单

伪代码示例：

```javascript
import ModalForm from './modal-form.jsx';
const ns = 'namespace.';

// ...

const { visible } = this.state;

// ...

return (
  <ModalForm 
    icon="setting" 
    title="模态框：配置XXX"
    visible={visible} 
    items={[
      {
        type: 'hidden', 
        name:'id',
        value: '1',
      }
    ].concat(
      [/* ..分组数据.. */].map(vals=>{
        const { _key, name, status='off' } = vals;
        const ns = 'config.'+_key+'.';
        return {
          type: 'group', 
          items:[
            {
              label: '分组名字',
              type: 'sub-title',
              value: name
            },
            {
              label: '是否开启',
              type: 'Radios',
              name: ns+'status',
              value: status,
              options: [
                { value:'off', label:'关闭' },
                { value:'on', label:'开启' }
              ],
              required: true
            },
            {
              label: '字段1',
              type: 'hidden',
              name: ns+'f1',
              value: name
            },
          ]
        };
      })
    )}
    url="/save/data"
    onSaveSuccess={()=>getList()}
    onCancel={()=>this.setState({ visible: false })} 
  />
);
```
## 搜索栏

伪代码示例：

```javascript
import ModalForm from './search-form.jsx';
return (
<SearchForm 
  onSubmit={(data)=>getList({ ...data, page:1 })} 
  items={[
    {
      type: 'RadioButtons', 
      name: 'status', 
      value: status,
      options: [{ value:'1', label:'status 1' },{ value:'2', label:'status 2' }],
      onChange:(e)=>getList({ status: e.target.value, page:1, keyword:'' }),
      style: {float: 'left'},
    },
    {
      name: 'keyword', 
      value: keyword,
      placeholder: '请输入搜索内容'
    }
  ]}
/>
);
```
