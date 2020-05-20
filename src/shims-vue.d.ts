declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "vuedraggable";
declare module "vue-draggable-resizable-gorkys";

declare module "vue/types/vue" {
  import { ElMessage } from "element-ui/types/message";

  interface Vue {
    $message: ElMessage;
  }
}