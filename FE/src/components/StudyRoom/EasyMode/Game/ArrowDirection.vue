<template>
  <div class="background" tabindex="0" @keyup="checkKey" ref="div">
    <GameTimer @TimeOut="failSuddenAttack"/>
    <span v-for="(i, index) in icons" :key="index">
      <i :class="i.name" :id="index"></i>
    </span>
  </div>
</template>

<script>
import GameTimer from "@/components/StudyRoom/EasyMode/Game/GameTimer.vue";
export default {
  components: { GameTimer },
  data() {
    return {
      icons: [],
      currentIndex: 0,
    };
  },
  created() {
    for (var i = 0; i < 8; i++) {
      var flag = Math.floor(Math.random() * 4);
      console.log(flag);
      if (flag == 0) {
        this.icons[i] = { name: "fa-solid fa-circle-arrow-down", code: "ArrowDown" };
      } else if (flag == 1) {
        this.icons[i] = { name: "fa-solid fa-circle-arrow-left", code: "ArrowLeft" };
      } else if (flag == 2) {
        this.icons[i] = { name: "fa-solid fa-circle-arrow-right", code: "ArrowRight" };
      } else if (flag == 3) {
        this.icons[i] = { name: "fa-solid fa-circle-arrow-up", code: "ArrowUp" };
      }
    }
  },
  mounted() {
    console.log("mount");
    this.$refs.div.focus();
    console.log(this.$refs.div);
  },
  methods: {
    checkKey(e) {
      if (e.key === this.icons[0].code) {
        this.icons.splice(0, 1);
        if (this.icons.length === 0) {
          this.successSuddenAttack();
        }
      }
    },
    successSuddenAttack() {
      this.$emit("endSuddenAttack", true);
    },
    failSuddenAttack() {
      this.$emit("endSuddenAttack", false);
    },
  },
};
</script>

<style scoped>
i {
  --color: red;
  font-size: 8em;
  color: var(--color);
}
.background {
  width: 100vw;
  height: 100vh;
  background-color: black;
  animation: blackout 1.5s;
  text-align: center;
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
