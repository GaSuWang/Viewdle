<template>
  <div>
    <span :style="cssVariable" class="wave"></span>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    stack: Number,
  },
  computed: {
    cssVariable() {
      return {
        
        "--stack-count": "-" + this.stack * 24 + "%",
      };
    },
  },
};
</script>

<style scoped>
div {
  margin-left: 1%;
  margin-top: 1%;
  display: inline-block;
  width: 4%;
  height: 80%;
  background: linear-gradient(red, yellow);
  position: relative;
  padding: 0.8em 1em;
  border: 3px solid #333;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(black, 0.2);
  background: lighten(#f0f4c3, 10%);
  transform: translate3d(0, 0, 0);
}
.wave {
  --stack-count: 10%;
  top: var(--stack-count);
  left: 0%;
  position: absolute;
  background: black;
  width: 100%;
  height: 100%;
  transition-duration: 0.75s;
}
</style>
