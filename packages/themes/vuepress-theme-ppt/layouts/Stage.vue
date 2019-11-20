<template>
  <div class="full-screening-container">
    <Content id="pptStage" />
  </div>
</template>

<script>
export default {
  name: 'Stage',
  mounted() {}
};
</script>

<style lang="stylus" scoped>
  .full-screening-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    width: 100vw;
    height: 100%;
    height: 100vh;
  }
</style>
