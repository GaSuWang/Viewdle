<template>
  <div class="background" tabindex="0" @keyup="checkKey" ref="div">
    <GameTimer class="timer" @TimeOut="failSuddenAttack" />

    <div class="container" style="width : 40vw">
      <div class="row row-cols-4">
        <div class="arrowSpan" v-for="(i, index) in icons" :key="index">
          <i :class="i.name" :id="index"></i>
        </div>
      </div>
    </div>
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
    for (var i = 0; i < 12; i++) {
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
    setTimeout(() => {
      this.$refs.div.focus();
    }, 1500);
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
.timer {
  color: white;
}

.arrowSpan{
  margin : 0;
  padding : 0;
}
i {
  --color: #da3b22;
  font-size: 8vw;
  color: var(--color);
  margin : 0;
  padding : 1vw 0vw 0vw 0vw;
  text-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  animation: fade .25s infinite alternate;
}
.background {
  width: 100vw;
  height: 100vh;
  /* background-color: black; */
  background-color: rgba(0,0,0,0.9);
  animation: blackout 1.25s;
  text-align: center;
}

@keyframes fade {
  0%, 7% {
    transform: rotateZ(0);
  }
  15% {
    transform: rotateZ(-15deg);
  }
  20% {
    transform: rotateZ(10deg);
  }
  25% {
    transform: rotateZ(-10deg);
  }
  30% {
    transform: rotateZ(6deg);
  }
  35% {
    transform: rotateZ(-4deg);
  }
  40%, 100% {
    transform: rotateZ(0);
  }
}

@keyframes blackout {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.9;
  }
}
</style>
