<template>
  <div class="widget-item text-widget" :style="borderStyle">
    <textarea
      v-if="widgetEditable"
      class="text-box edit-box"
      v-model="textValue"
      :readonly="!widgetEditable"
      :style="textStyle"
    ></textarea>

    <div v-else class="text-box preview-box">
      <span v-show="showPlaceholder" class="placeholder-tip">
        <span>双击输入文本</span>
      </span>
      <span
        class="preview-text"
        :style="[textStyle, previewAlignment]"
        v-html="formatedText"
      ></span>
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
export default class TextWidget extends Vue {
  @Prop()
  data!: StoryWidget<widgetConfig.TextArea>;

  @Inject()
  widgetConfig!: WidgetPageConfig;

  /**
   * 可编辑状态
   */
  get widgetEditable() {
    return this.widgetConfig.widgetEditMode;
  }

  get showPlaceholder() {
    return this.widgetConfig.pageEditMode && this.textValue === "";
  }

  /**
   * 文本值
   */
  get textValue(): widgetConfig.TextArea["value"] {
    return this.data.config.value;
  }

  set textValue(value: string) {
    this.data.config.value = value;
  }

  get formatedText() {
    return this.textValue.replace(/\n/g, "<br>");
  }

  /**
   * 字体配置
   */
  get textFont(): widgetConfig.TextArea["font"] {
    return this.data.config.font;
  }

  /**
   * 对齐配置
   */
  get textAlignment(): widgetConfig.TextArea["alignment"] {
    return this.data.config.alignment;
  }

  /**
   * 边框配置
   */
  get borderConfig(): widgetConfig.Border {
    return this.data.config.border;
  }

  get scaledFontSize() {
    return this.textFont.size * this.widgetConfig.scale;
  }

  get textStyle() {
    return {
      color: this.textFont.color,
      "font-size": this.scaledFontSize + "px",
      "font-weight": this.textFont.bold ? "bold" : "normal",
      "font-style": this.textFont.italic ? "italic" : "normal",
      "text-decoration": this.textFont.underline ? "underline" : "none",
      "text-align": this.textAlignment.horizontal
    };
  }

  alignmentMapping = {
    horizontal: {
      left: "flex-start",
      center: "center",
      right: "flex-end"
    },
    vertical: {
      top: "flex-start",
      middle: "center",
      bottom: "flex-end"
    }
  };

  get previewAlignment() {
    return {
      "justify-content": this.alignmentMapping.horizontal[
        this.textAlignment.horizontal
      ],
      "align-items": this.alignmentMapping.vertical[this.textAlignment.vertical]
    };
  }
}
</script>

<style lang="scss">
.text-widget {
  .text-box {
    font-family: auto;
    width: 100%;
    height: 100%;
  }

  .edit-box {
    border: none;
    resize: none;
    outline: none;
  }

  .preview-box {
    .placeholder-tip {
      width: 100%;
      height: 100%;
      font-size: 20px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: #858585;
    }

    .preview-text {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
