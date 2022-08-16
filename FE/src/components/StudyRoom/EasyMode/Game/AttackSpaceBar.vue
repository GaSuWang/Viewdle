<template>
  <div class="background" tabindex="0" @keyup.space="pumpWater" ref="back">
    <span :style="cssVariable" class="wave"></span>
    <div class="guard"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        interval:null,
      waterHigh: 55,
    };
  },
  mounted() {
    setTimeout(() => {
      this.interval = setInterval(() => {
        this.$refs.back.focus();
        this.waterHigh += 1;
        if (this.waterHigh > 100) {
             this.failSuddenAttack();   
          clearInterval(this.interval);
         
        }
      }, 45);
    }, 1000);
  },
  computed: {
    cssVariable() {
      return {
        
        "--top": "-" + this.waterHigh + "%",
      };
    },
  },
  methods: {
    successSuddenAttack() {
      this.$emit("endSuddenAttack", true);
    },
    failSuddenAttack() {
      this.$emit("endSuddenAttack", false);
    },
    pumpWater() {
      this.waterHigh -= 5;
      if (this.waterHigh < 0) {
        clearInterval(this.interval);
        this.successSuddenAttack();
      }
    },
  },
};
</script>

<style>
.background {
  background-color: #47A0FF;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.wave {
  --top: -55%;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: var(--top);
  background: rgb(209, 209, 209);
  transition-duration: 0.1s;
  animation: waterover 1s;
}
@keyframes waterover {
  from {
    top: 0%;
  }
  to {
    top: -55%;
  }
}
</style>
