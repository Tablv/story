<template>
  <div class="page-gallery-box">
    <div class="thumbnail-list" v-if="state.data">
      <draggable>
        <div
          class="thumbnail-wrapper"
          v-for="page in state.data.pages"
          :key="page.id"
        >
          <page-thumbnail
            :data="page" @select-story="setCurrentPage" />
        </div>
      </draggable>
    </div>

    <div class="thumbnail-container">
      <div class="thumbnail-box" @click="addPage">
        <button class="add-btn">
          <i class="fa fa-plus"></i>
        </button>
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Inject } from 'vue-property-decorator';
import draggable from "vuedraggable";
import PageThumbnail from "./PageThumbnail.vue";
import Page from "@/types/Page";

@Component({
  components: {
    draggable,
    PageThumbnail
  }
})
export default class PageGallery extends Vue {

  @Inject()
  state!: Page.State;

  setCurrentPage(index: number) {
    this.state.currentIndex = index;
  }

  addPage() {
    this.state.data?.pages.push();
  }

}
</script>

<style lang="scss" scoped>
.page-gallery-box {
  height: 100%;
  user-select: none;
  
  .thumbnail-list {
    .thumbnail-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column nowrap;
      margin-top: 24px;

      &:last-of-type {
        margin-bottom: 24px;
      }
    }
  }
}
</style>