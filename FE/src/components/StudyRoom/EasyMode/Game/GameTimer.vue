<template>
  <!-- <div>
    <span class="timer">{{ time }}</span>
  </div> -->

  <div class="progressBar">
      <div id="bar" class="innerbar"></div>
  </div>
</template>

<script>
export default {
  props : ["endSuddenAttack"],
  data() {
    return {
      time: "6.00",
      timeSec: 6,
      timeMiliSec: 0,
      timer: null,

      progressbarHandler: null,
      timeBegan: null,
      MAX_TIME: 6000,
      // audio : null,
    };
  },
  watch : {
    endSuddenAttack(){
      console.log("변함")
      // this.audio.pause();
    }
  },
  mounted() {
    setTimeout(() => {
      this.timerStart();
      this.start();
    }, 1600);
  },

  methods: {
    timeOut() {
      this.time = "0.00";
      this.$emit("timeOut");
    },
    timerStart() {
      let el = document.getElementById("bar");
      el.style.width = "0%";

      this.timer = setInterval(() => {
        if (this.timeSec <= 0 && this.timeMiliSec <= 0) {
          clearInterval(this.timer);
          this.timeOut();
          clearInterval(this.progressbarHandler);
          this.progressbarHandler = null;
        } else {
          if (this.timeMiliSec === 0) {
            this.timeSec--;
            this.timeMiliSec = 100;
          }
          this.timeMiliSec--;
          this.time = this.timeSec + "." + this.timeMiliSec;
        }
      }, 10);
    },

    start() {
      this.timeBegan = new Date();
      let el = document.getElementById("bar");
      el.style.width = "0%";
      // this.audio = new Audio('https://firebasestorage.googleapis.com/v0/b/test-b1def.appspot.com/o/tiktak.mp3?alt=media&token=8c73354c-e263-46e2-b7f7-4b95f63da61f');
      // this.audio.play();
      // this.audio.volume = 0.5;

      if (this.progressbarHandler == null) {
        this.progressbarHandler = setInterval(this.updateProgressbar, 30);
      }
    },

    updateProgressbar() {
      var currentTime = new Date(),
        timeElapsed = new Date(
          this.countDownTime - (currentTime - this.timeBegan)
        );
        timeElapsed
      let time = currentTime - this.timeBegan;
      let el = document.getElementById("bar");
      let width = (1 - time / this.MAX_TIME) * 100 + "%";
      width = parseFloat(width).toFixed(2);
      if (width > 100) width = 100;
      let widthStr = width + "%";
      el.style.width = widthStr;
    },

  },
};
</script>

<style scoped>

.progressBar {
  max-width: 40vw;
  width: 90%;
  margin: 10px auto;
  margin-top: 100px;
  height: 2vw;


  border-radius: 10px;
  background: linear-gradient(#6fa6d66c, #7db1df54);
}

.innerbar {
  max-width: 40vw;
  height: 100%;
  text-align: right;
  height: 2vw; /* same as #progressBar height if we want text middle aligned */
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(red, yellow);
}

/* div {
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
  --stack-count: -1%;
  top: var(--stack-count);
  left: 0%;
  position: absolute;
  background: black;
  width: 100%;
  height: 100%;
  transition-duration: 0.75s;
} */
</style>