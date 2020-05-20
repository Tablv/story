import { newVue } from "@/dependencies/vue-instance";
import Storyboard from "./storyboard.vue";

// CSS
import "font-awesome/css/font-awesome.min.css";
import "animate.css";
import "@/assets/font/iconfont.css";

// Element-UI
import "@/dependencies/element-ui.js";

// Vue-Clipboard
import "@/dependencies/vue-clipboard";

// BI 依赖
import "@/dependencies/glaway-bi"

// Svg Icons
import "@/assets/font/svg_icon.css";
import "@/assets/font/svg_icon.js";

import AxiosUtil from "glaway-bi-util/AxiosUtil";

// 设置API上下文
AxiosUtil.setBasePath("/admin");

// Vue 实例
newVue(Storyboard, "#app");
