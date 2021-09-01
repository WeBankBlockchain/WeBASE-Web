<template>
  <div id="bigScreen" class="largeScreen">
    <large-sreen-load v-if="loadShow"></large-sreen-load>
    <div v-else id="largeContent">
      <large-sreen-header></large-sreen-header>
      <large-sreen-middle></large-sreen-middle>
      <large-sreen-footer></large-sreen-footer>
    </div>
  </div>
</template>

<script>
import LargeSreenFooter from "./largeSreenFooter.vue";
import LargeSreenHeader from "./largeSreenHeader.vue";
import LargeSreenLoad from "./largeSreenLoad.vue";
import LargeSreenMiddle from "./largeSreenMiddle.vue";
export default {
  name: "index",
  components: {
    LargeSreenHeader,
    LargeSreenFooter,
    LargeSreenMiddle,
    LargeSreenLoad,
  },
  data() {
    return {
      loadShow: false,
    };
  },
  methods: {},
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#bigScreen {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000000;
  /* min-height: 720px;
  min-width: 1280px; */
}
#largeContent{
  padding-top: 12px;
  width: 100%;
  height: 100%;
}
</style>
