<template>
  <ul
    v-if="visible"
    v-clickoutside="closeMenu"
    class="el-dropdown-menu el-popper gw-context-menu"
    :class="menuSize ? 'el-dropdown-menu--' + menuSize : ''"
    :style="positionStyle"
  >
    <li
      v-for="(menu, index) in menuList"
      :key="index"
      :class="{
        'is-disabled': menu.disabled,
        'el-dropdown-menu__item--divided': menu.divided
      }"
      class="el-dropdown-menu__item"
      @click="handler($event, menu.handle)"
    >
      <span>{{ menu.name }}</span>
    </li>
    
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement, VNode } from 'vue';
import clickoutside from "element-ui/src/utils/clickoutside";

@Component({
  directives: { clickoutside }
})
export default class ContextMenu extends Vue {
  @Prop()
  list!: Array<ContextMenuItem>;

  @Prop({ default: false })
  visible!: boolean;

  @Prop({ default: () => { return { top: 0, left: 0 } } })
  position!: { top: number; left: number };

  @Prop({ default: true })
  hideOnClick!: boolean;

  @Prop()
  size!: undefined | "medium" | "small" | "mini";

  get menuSize() {
    return this.size || ((this as any).$ELEMENT || {}).size;
  }

  get menuList() {
    return this.list || this.slotList;
  }

  get slotList(): Array<ContextMenuItem> {
    const list = this.$slots.default?.map((node: VNode) => {
      return {
        name: node.children?.map((child: VNode) => child.text).join(""),
        divided: node.data?.attrs?.divided !== undefined,
        disabled: node.data?.attrs?.disabled !== undefined,
        handle: (e: MouseEvent) => {
          const clickEvents = node.data?.on?.click;
          if (clickEvents) {
            const callbacks = typeof clickEvents === "function" ? [ clickEvents ] : clickEvents;
            callbacks.forEach((callback: Function) => {
              callback.apply(node.context, e);
            });
          }
        }
      };
    }) as Array<ContextMenuItem> | undefined;

    return list || [];
  }

  created() {
    const a = this.slotList;
  }

  get positionStyle() {
    return {
      top: this.position.top + "px",
      left: this.position.left + "px"
    };
  }

  handler(event: Event, handle: Function) {
    handle && handle(event);

    if (this.hideOnClick) {
      this.closeMenu();
    }
  }

  mounted() {
    document.body.appendChild(this.$el);
  }

  closeMenu() {
    this.$emit("update:visible", false);
  }
}

export interface ContextMenuItem {
  name: string;

  divided?: boolean;

  disabled?: boolean;

  handle: Function;
}
</script>
