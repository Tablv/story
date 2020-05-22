<template>
  <div class="tool-bar-inner img-tool-bar">
    <el-input v-model="imgUrl" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({
  components: {}
})
export default class ImageToolBar extends Vue {
  @Inject()
  state!: Page.State;

  get widget(): StoryWidget<widgetConfig.Image> {
    return this.state.currentWidget as StoryWidget<widgetConfig.Image>;
  }

  get imgUrl(): widgetConfig.Image['url'] {
    return this.widget.config.url;
  }
}
</script>

<style lang="scss">
.img-tool-bar {
}
</style>
