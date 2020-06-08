<template>
  <section class="story-slide">
    <div v-if="widgets" class="widgets">
      <div v-for="widget in widgets" :key="widget.id">
        <span class="widget" :style="getPosition(widget)">
          <widget :data="widget" @click.native.stop></widget>
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Provide, Watch, Prop } from "vue-property-decorator";

import { WidgetType } from "@/config/WidgetType";
import StoryBuilder from "@/config/StoryBuilder";
import { widgetConfig, StoryWidget } from "@/types/StoryWidget";
import { StoryPage } from "@/types/Story";

import Widget, { WidgetPageConfig } from "@/components/Widget.vue";

let syncThumbnail!: Function;

@Component({
  components: {
    Widget
  }
})
export default class StorySlide extends Vue {
  @Prop()
  page!: StoryPage;

  @Provide()
  widgetConfig: WidgetPageConfig = {
    editable: false,
    scale: 1
  };

  get widgets() {
    return this.page?.widgets;
  }

  getPosition(widget: StoryWidget<widgetConfig.Base>) {
    return {
      left: widget.config.position.x,
      top: widget.config.position.y
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
  position: relative;

  .widgets {
    width: 100%;
    height: 100%;

    .widget {
      position: absolute;
    }
  }
}
</style>
