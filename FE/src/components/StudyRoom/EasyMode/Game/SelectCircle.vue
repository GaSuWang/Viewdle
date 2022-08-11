<template>
  <canvas class="background">
    <!-- 타이머 5초짜리 -->
    <!-- 화살표 넣기 -->
  </canvas>
</template>

<script>
export default {
  data() {
    return {
      selectedCircle: 0,
    };
  },
  created() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth - 15;
    canvas.height = window.innerHeight - 15;
    ballNumber = 8;
    balls = [];
  },
};
</script>

<style>
.background {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  animation: blackout 1s;
}
@keyframes blackout {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
