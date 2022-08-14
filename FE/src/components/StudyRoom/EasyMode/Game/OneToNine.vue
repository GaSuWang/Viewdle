<template>
  <div class="background">
    <GameTimer class="timer" @TimeOut="failSuddenAttack" :endSuddenAttack='endSuddenAttack'/>
    <div class="d-flex justify-content-center">
      <div v-for="(row,index) in number2D" :key="index" class="">
        <div class="cell d-flex justify-content-center align-items-center" v-for="(cell,index2) in row" :key="index2" @click="clickCell(cell.num,index,index2)"  :style="{visibility: cell.flag}">
          <p style="margin : 0">{{cell.num}}</p>
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
      number: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      number2D:[],
      currentNum:1,
      endSuddenAttack : false,
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
      this.endSuddenAttack = true;
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
    margin: 4vw 2vw 0vw 2vw;

    display: inline-block;
    width: 8vw;
    height: 8vw;
    background: #ffcc74;
    border: 1px #fcab1f solid;
    box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
    border-radius: 5%;
    text-align: center;
    /* animation: bounce-in 1.5s; */
    animation: beat .25s infinite alternate;

    font-size: 100px;
    font-family: 'SDSamliphopangche_Basic';
    /* text-shadow: 1px 2px 2px; */
    text-shadow: -1px 0 #555, 0 1px #555, 1px 0 #555, 0 -1px #555;
    color : #555
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

@keyframes beat{
	to { transform: scale(1.15); }
}

@font-face {
    font-family: 'SDSamliphopangche_Basic';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts-20-12@1.0/SDSamliphopangche_Basic.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
</style>
