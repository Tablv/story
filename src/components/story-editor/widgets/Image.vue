<template>
  <div class="widget-item img-widget">
    <el-image
      v-if="imgUrl"
      :src="imgUrl"
      fit="contain"
    ></el-image>

    <div class="placeHolderTip" v-else>
      <span>请先选择图片</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import Page from "@/types/Page";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";

@Component({
  components: {}
})
export default class ImageToolBar extends Vue {
  @Inject()
  state!: Page.State;

  @Inject()
  widgetData!: StoryWidget<widgetConfig.Image>;

  get imgUrl(): widgetConfig.Image['url'] {
    return this.widgetData.config.url;
  }
}
</script>

<style lang="scss">
.img-widget {
  width: 100%;
}
</style>
