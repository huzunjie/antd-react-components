/* 表单项布局配置 */
export const fil_fun = (label=24, wrap=24, xl=24, xw=24)=>({
  labelCol: {
    xs: { span: xl },
    sm: { span: label },
  },
  wrapperCol: {
    xs: { span: xw },
    sm: { span: wrap },
  },
});

export default fil_fun(4, 18);

export const wss15 = fil_fun(4, 15);
export const xs_16_8 = fil_fun(8, 8, 16, 16);

