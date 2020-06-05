import { newVue } from "@/dependencies/vue-instance";
import Module from "./index.vue";

// CSS
import "@fortawesome/fontawesome-free/css/all.min.css";
import "animate.css";

// Element-UI
import "@/dependencies/element-ui.js";

// Vue-Clipboard
import "@/dependencies/vue-clipboard";

// BI 依赖
import "@/dependencies/glaway-bi";

import AxiosUtil from "glaway-bi-util/AxiosUtil";
import "@/dependencies/axios";

// 设置API上下文
AxiosUtil.setBasePath("/admin");

// Vue 实例
newVue(Module, "#app");
