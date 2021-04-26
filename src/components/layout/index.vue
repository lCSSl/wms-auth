<template>
  <div>
    <AppHeader/>
    <div class="mxg-main">
      <!-- 主区域组件渲染出口 -->
      <router-view></router-view>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import AppHeader from "@/components/layout/AppHeader/index";
import AppFooter from "@/components/layout/AppFooter/index";

export default {
  components: {
    AppHeader,
    AppFooter,
  }
}
</script>

<style scoped>
.mxg-main {
  min-height: 700px;
  width: 100%;
}
</style>