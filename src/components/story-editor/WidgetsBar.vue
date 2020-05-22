<template>
  <div class="widgets-bar">
    <!-- 文本 -->
    <div
      class="block-btn draggable"
      draggable="true"
      @dragstart="dragWidgetHandle('text')"
    >
      <i class="fa fa-i-cursor"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from "vue-property-decorator";
import Page from "@/types/Page";

@Component({
  components: {}
})
export default class WidgetsBar extends Vue {
  @Inject()
  state!: Page.State;
}
</script>

<style lang="scss" scoped>
.widgets-bar {
  height: 100%;

  $blockSize: 84px;

  .block-btn {
    width: $blockSize;
    height: $blockSize;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    cursor: pointer;

    &.draggable {
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    &:hover {
      background-color: #e6e9ec;
    }
  }
}
</style>
