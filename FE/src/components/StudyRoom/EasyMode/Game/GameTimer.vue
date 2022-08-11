<template>
  <div>
    <span class="timer">{{time}}</span>
  </div>
</template>

<script>
export default {
    data() {
        return {
            time:"8.00",
            timeSec:8,
            timeMiliSec:0,
            timer:null,
        }
    },
    mounted() {
        setTimeout(() => {
            this.timerStart();
        }, 1600);
       
    },
    methods: {
        timeOut(){
            this.time = "0.00";
            this.$emit("timeOut");
        },
        timerStart(){
             this.timer = setInterval(() => {
            if(this.timeSec<=0&&this.timeMiliSec<=0){
                clearInterval(this.timer);
                this.timeOut();
            }
            else{
                 if(this.timeMiliSec===0){
                this.timeSec--;
                this.timeMiliSec=100;
            }
            this.timeMiliSec--;
            this.time = this.timeSec+"."+this.timeMiliSec;
            }
           
        },10);
        }
    },
}
</script>

<style scoped>
.timer{
    color: white;
}
</style>