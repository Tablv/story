<template>
  <div class="tool-bar-inner img-tool-bar">
    <!-- <el-popover placement="bottom-start" width="400" trigger="click">
      <el-button slot="reference" icon="fa fa-image"></el-button>

    </el-popover> -->

    <!-- 边框 -->
    <border-style :data="widget.config.border"></border-style>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import BorderStyle from "./common/BorderStyle.vue";

@Component({
  components: {
    BorderStyle
  }
})
export default class ImageToolBar extends Vue {
  @Inject()
  state!: Page.State;

  get widget(): StoryWidget<widgetConfig.Image> {
    return this.state.currentWidget as StoryWidget<widgetConfig.Image>;
  }

  get imgUrl(): widgetConfig.Image["url"] {
    return this.widget.config.url;
  }

  set imgUrl(url: widgetConfig.Image["url"]) {
    this.widget.config.url = url;
  }
}
</script>

<style lang="scss">
.img-tool-bar {
  > * + * {
    margin-left: 10px;
  }
}
</style>
