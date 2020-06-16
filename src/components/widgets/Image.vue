<template>
  <div class="img-widget" :style="borderStyle">
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
import { WidgetPageConfig } from "../Widget.vue";

@Component({
  mixins: [BorderConfigurable]
})
export default class ImageWidget extends Vue {
  @Prop()
  data!: StoryWidget<widgetConfig.Image>;

  @Inject()
  widgetConfig!: WidgetPageConfig;

  get imgUrl(): widgetConfig.Image["url"] {
    return this.data.config.url;
  }
}
</script>

<style lang="scss">
.img-widget {
  .el-image {
    width: 100%;
    height: 100%;
  }

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
