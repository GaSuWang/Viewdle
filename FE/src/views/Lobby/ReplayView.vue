// 임현탁
<template>
<div class="ReplayViewBoss">
  <NavBar class="NavView"/>
  <div class="ReplayView">
    <p class="pagetitle">Replay</p>
    <div class='ReplayTop'>
      <div class="dropdown ReplayTopitem">
        <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          정렬
        </button>
        <ul class="dropdown-menu">
          <li><input type="checkbox" @click="filterReplay(credentialsToFilterReplay)" v-model="credentialsToFilterReplay.order" true-value="ASC">오래된순</li>
          <li><input type="checkbox" @click="filterReplay(credentialsToFilterReplay)" v-model="credentialsToFilterReplay.order" true-value="DESC">최신순</li>
        </ul>
      </div>
      <button class="btn btn-secondary ReplayTopitem" data-bs-toggle="modal" data-bs-target="#deleteReplay">
        삭제하기
      </button>
    </div>
      <hr>
      <div class="ReplayBody">
        <ReplayCard/>
      </div>
    <!-- 오래된순, 최신순 정렬 -->
    <!-- 카드들 반응형에 따라 3*3 or 3*2 or 2*2 -->
    <!-- 영상 삭제모달  -->
      <div class="modal fade" id="deleteReplay" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="deleteReplay(credentialsTodelete)">
              <h5 class="modal-title" id="staticBackdropLabel">몇번 삭제할래?</h5>
              <input type="number" class="form-control form-control-lg" v-model="credentialsTodelete.replaySeq">
              <button class="btn btn-secondary">Yes</button>
            </form>
            <button class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          </div>
        </div>
      </div>

    <!-- 영상 다시보기 -->
    <div class="modal fade" id="enterReplay" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
          {{replayDetail.videoSeq}}
          {{replayDetail.Title}}
          {{replayDetail.videoRegTime}}
          {{replayDetail.videoUrl}}
          {{replayDetail.feedbackList}}

          <!-- 동영상 삽입 및 AI 평가 입력 -->
          <video id="video" ref="video" crossOrigin='anonymous' width="300" height="200" controls="" autoplay="" name="media" >
              <source src="https://localhost:4443/openvidu/recordings/SessionA~2/SessionA~2.mp4" type="video/mp4">
              <!-- <source src = "file://C:/Users/multicampus/Desktop/test.mp4"> -->
          </video>
          <div>
            <!-- style="display: none" -->
            <canvas id="canvas" ref="canvas" style="display: none" ></canvas>
          </div>
          <div>
            {{ maxClassName }}
          </div>


          </div>
        </div>
    </div>  
  </div> 
  </div>  
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
import ReplayCard from '@/components/Lobby/ReplayCard.vue'
import { useStore } from 'vuex'
import { reactive, computed } from "vue";

// AI 코드
import * as tmPose from '@teachablemachine/pose';

export default {
  components:{
    NavBar,
    ReplayCard 
  },

  setup(){
    const credentialsTodelete= reactive({
      'replaySeq':0,
    })
    const credentialsToFilterReplay= reactive({
      order:"",
    })
    const store = useStore()
    const replayDetail = computed(
      () => store.state.rhtModule.ReplayDetail
    );
    function deleteReplay(){
      store.dispatch('rhtModule/deleteReplay', credentialsTodelete)
    }
    function filterReplay(){
      store.dispatch('rhtModule/filterReplay', credentialsToFilterReplay)
    }
    return {
      deleteReplay, credentialsTodelete, replayDetail,filterReplay, credentialsToFilterReplay
    }
  },

  // AI 자세평가 코드
  data () {
    return {
      context : null,
      model : null,
      maxPredictions : null,
      result : null,

      maxClassName : null,
      maxProbability : null,
      posenetOutput : null,
      prediction : null,

      video : null,
      canvas : null,
    }
  },

  async mounted() {

    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;

    this.context = this.$refs.canvas.getContext('2d');

  
    this.canvas.setAttribute("width", this.video.width/2);
    this.canvas.setAttribute("height", this.video.height);

    const modelURL = `https://teachablemachine.withgoogle.com/models/Td01sX2R5/model.json`
    const metadataURL = `https://teachablemachine.withgoogle.com/models/Td01sX2R5/metadata.json`

    this.model = Object.freeze(await tmPose.load(modelURL, metadataURL));
    
    this.maxPredictions = this.model.getTotalClasses();    


    await this.predict();
  },

  methods : { 
   async predict() {
      this.context.drawImage(this.video, 0, 0, this.video.width, this.video.height);
      const {pose, posenetOutput}= await this.model.estimatePose(this.canvas);

      this.maxProbability = 0;
      pose;
      // console.log(posenetOutput)

      this.prediction = await this.model.predict(posenetOutput);

      for (let i = 0; i < this.maxPredictions; i++) {
        if (this.prediction[i].probability>this.maxProbability) {
          this.maxClassName = this.prediction[i].className;
          this.maxProbability = this.prediction[i].probability;
        }        
      }

      // console.log(this.maxClassName)
          
      setTimeout(() => {
        this.predict();
      }, 100);         
    }
  }

}
</script>

<style>
.ReplayViewBoss{
  width: 90%;
  height: 90%;
  background : rgb(255,255,255,0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.NavView{
  height: 100%;
  width: 250px;
}
.ReplayView{

  height: 100%;
  width: 80%;
}
.ReplayTop{
  background: white;
  border-radius: 20px;
  width:98%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}
.ReplayTopitem{
  margin:0 20px;
  margin-left: 20px;
}
.pagetitle{
  margin-top: 20px;
}
.ReplayBody{
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 98%;
  height: 83%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  overflow: scroll;
}
</style>