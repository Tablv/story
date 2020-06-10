<template>
  <section class="story-slide">
    <div v-if="widgets" class="slide-widgets">
      <span
        v-for="widget in widgets"
        :key="widget.id"
        class="slide-widget"
        :style="getWidgetStyle(widget)"
      >
        <widget :data="widget"></widget>
      </span>
    </div>
  </section>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Provide,
  Watch,
  Prop,
  Inject
} from "vue-property-decorator";

import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";

import Widget, { WidgetPageConfig } from "@/components/Widget.vue";
import { scaledStyle } from "@/util/scale-util";

let syncThumbnail!: Function;

@Component({
  components: {
    Widget
  }
})
export default class StorySlide extends Vue {
  @Prop()
  scale!: number;

  @Prop()
  page!: StoryPage;

  @Provide()
  widgetConfig: WidgetPageConfig = {
    pageEditMode: false,
    widgetEditMode: false,
    scale: this.screenScale
  };

  get widgets() {
    return this.page?.widgets;
  }

  get screenScale() {
    return this.scale;
  }

  @Watch("screenScale")
  syncScale() {
    this.widgetConfig.scale = this.screenScale;
  }

  getWidgetStyle(widget: StoryWidget<widgetConfig.Base>) {
    const { position, size } = scaledStyle.getWidgetSize(
      widget.config,
      this.widgetConfig.scale
    );

    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size.width}px`,
      height: `${size.height}px`
    };
  }
}
</script>

<style lang="scss" scoped>
.story-slide {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  margin: auto;
  background-color: #fff;
  user-select: none;
  overflow: hidden;

  .slide-widgets {
    width: 100%;
    height: 100%;

    .slide-widget {
      position: absolute;
    }
  }
}
</style>
