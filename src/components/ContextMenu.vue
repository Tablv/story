<template>
  <ul
    v-if="visible"
    class="el-dropdown-menu el-popper gw-context-menu"
    :class="menuSize ? 'el-dropdown-menu--' + menuSize : ''"
    :style="positionStyle"
  >
    <li
      v-for="(item, index) in list"
      :key="index"
      :class="{
        'is-disabled': item.disabled,
        'el-dropdown-menu__item--divided': item.divided
      }"
      class="el-dropdown-menu__item"
      @click="handler(item.handle, $event)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class ContextMenu extends Vue {
  @Prop()
  list!: Array<ContextMenuItem>;

  @Prop({ default: false })
  visible!: boolean;

  @Prop({ default: { top: 0, left: 0 } })
  position!: { top: number; left: number };

  @Prop({ default: true })
  hideOnClick!: boolean;

  @Prop()
  size!: undefined | "medium" | "small" | "mini";

  get menuSize() {
    return this.size || ((this as any).$ELEMENT || {}).size;
  }

  get positionStyle() {
    return {
      top: this.position.top + "px",
      left: this.position.left + "px"
    };
  }

  handler(handle: Function, event: Event) {
    handle(event);

    if (this.hideOnClick) {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.$emit("update:visible", false);
  }

  @Watch("visible")
  onVisibleUpdate() {
    if (this.visible) {
      window.addEventListener("click", this.clearPopover);
    }
  }

  clearPopover(e: any) {
    const isCtxMenu =
      e.path.filter((pathDOM: HTMLElement) => {
        if (pathDOM.classList) {
          let arr = [...pathDOM.classList];
          let val = arr.some(className => className === "gw-context-menu");
          return val;
        }
      }).length !== 0;

    if (!isCtxMenu) {
      this.closeMenu();
    }

    window.removeEventListener("click", this.clearPopover);
  }
}

export interface ContextMenuItem {
  name: string;

  divided?: boolean;

  disabled?: boolean;

  handle: Function;
}
</script>
