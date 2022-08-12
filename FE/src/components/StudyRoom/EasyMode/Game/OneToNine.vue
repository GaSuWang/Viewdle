<template>
  <div class="background">
    <GameTimer class="timer" @TimeOut="failSuddenAttack" />
    <div v-for="(row,index) in number2D" :key="index">
        <div class="cell" v-for="(cell,index2) in row" :key="index2" @click="clickCell(cell.num,index,index2)"  :style="{visibility: cell.flag}">{{cell.num}}</div>
    </div>
  </div>
</template>

<script>
import GameTimer from "@/components/StudyRoom/EasyMode/Game/GameTimer.vue";
export default {
  components: { GameTimer },
  data() {
    return {
      number: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      number2D:[],
      currentNum:1,
    };
  },
  created() {
    for (let i = this.number.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.number[i], this.number[j]] = [this.number[j], this.number[i]];
    }
    console.log(this.number);
    for(let i = 0;i<3;i++){
        this.number2D[i] = [];
        for(let j=0;j<3;j++){
            this.number2D[i][j] = {num:this.number[i*3+j],flag:"visible"};
        }
    }
    console.log(this.number2D);
  },
  methods: {
    successSuddenAttack() {
      this.$emit("endSuddenAttack", true);
    },
    failSuddenAttack() {
      this.$emit("endSuddenAttack", false);
    },
    clickCell(num,i,j){
        if(this.currentNum===num){
            this.currentNum++;
            this.number2D[i][j].flag = "hidden";
        }
        if(this.currentNum===10){
            this.successSuddenAttack();
        }
    }
  },
};
</script>

<style scoped>
.background {
  background-color: rgba(255,255,255,0.8);
  width: 100vw;
  height: 100vh;
}
.cell{
    cursor: pointer;
    margin: 2vw;
    font-size: 50px;
    display: inline-block;
    width: 20vw;
    height: 20vh;
    background: rgb(240, 90, 25);
    border-radius: 5%;
    text-align: center;
    animation: bounce-in 1.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
