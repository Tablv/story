<template>
  <div class="widget-item img-widget" :style="borderStyle">
    <el-image v-if="imgUrl" :src="imgUrl" fit="contain"></el-image>

    <div class="placeholder-tip" v-else>
      <i class="fa fa-image tip-icon"></i>
      <span class="tip-text">请先选择图片</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject, Prop } from "vue-property-decorator";
import Page from "@/types/EditorPage";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { WidgetType } from "@/config/WidgetType";
import BorderConfigurable from "./mixins/BorderConfigurable";

@Component({
  mixins: [BorderConfigurable]
})
export default class ImageWidget extends Vue {
  @Inject()
  state!: Page.State;

  @Prop()
  data!: StoryWidget<widgetConfig.Image>;

  get imgUrl(): widgetConfig.Image["url"] {
    return this.data.config.url;
  }
}
</script>

<style lang="scss">
.img-widget {
  width: 100%;

  .placeholder-tip {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    height: 100%;
    color: #797979;

    .tip-icon {
      font-size: 34px;
      margin-bottom: 6px;
    }
  }
}
</style>
