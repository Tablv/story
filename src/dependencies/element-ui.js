import Vue from "vue";

// 导入 Element-UI
import ElementUI from "element-ui";
import { Message, Loading } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

// 原型挂载
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading;

// 注册 ElementUI
Vue.use(ElementUI, { size: "small", zIndex: 7000 });
