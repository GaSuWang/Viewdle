// 임현탁
<template>
<div class="CLMBoss">
  <NavBar class="NavView"/>
  <div class="CLManageView">
    <div class='clmanageTop'>
        <button class="clmanageTopitem" data-bs-toggle="modal" data-bs-target="#clmaker">자기소개서 추가</button>
    </div>
      <hr>
    <div class="clmanageBody">
      <CLMCard/>  
    </div>
    </div> 


      <div class="modal fade" id="clmaker" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="createCoverLetter(credentials)">
            <div class="modal-header">
              <input type="Text" v-model="credentials.coverLetterTitle" class="CLTitle " placeholder="자기소개서 제목을 입력해주세요" /> 
            </div>
            <div class="modal-body">
              <textarea type="Text" v-model="credentials.coverLetterContent" class="CLContent " placeholder="내용을 입력해주세요" /> 
            </div> 
            <div class="modal-footer ">
              <button class="clCancle" @click.prevent data-bs-dismiss="modal"><router-link to="/cl">취소</router-link></button>
              <button class="clSubmit" data-bs-dismiss="modal">작성</button>
            </div>
            </form>
          </div>
        </div>
      </div>


      <div class="modal fade" id="detailofCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="updateCoverLetter(CoverLetterDetail)">
            <div class="modal-header">
              <input type="Text" v-model="CoverLetterDetail.coverLetterTitle" class="CLTitle" placeholder="자기소개서 제목을 입력해주세요" /> 
            </div>
            <div class="modal-body">
            <textarea type="Text" v-model="CoverLetterDetail.coverLetterContent"  class="CLContent " placeholder="내용을 입력해주세요" /> 
            </div>
            <div class="modal-footer">
              <button class="clCancle" @click.prevent data-bs-dismiss="modal"><router-link to="/cl">취소</router-link></button>
              <button class="clSubmit" data-bs-dismiss="modal">작성</button>
            </div>
            </form>
          </div>
        </div>
      </div>   
    
  </div>
</template>

<script>
import CLMCard from '@/components/Lobby/CLMCard.vue'
import NavBar from '@/components/Lobby/NavBar.vue'
import {useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { reactive, computed } from 'vue'
export default {
  components: {
    CLMCard,
    NavBar
  },
  setup(){
    const credentials =reactive({
      "coverLetterContent":"",
      "coverLetterTitle":""
    }) 
    const credentialsToedit =reactive({
      "coverLetterContent":'',
      "coverLetterSeq":'',
      "coverLetterTitle":''
    }) 
    const credentialsTodelete =reactive({
      "coverLetterSeq":''
    })
    const router = useRouter();
    const store = useStore();
    const CoverLetterList = computed(
      () => store.state.rhtModule.CoverLetterList
    );
    const CoverLetterDetail = computed(
      () => store.state.rhtModule.CoverLetterDetail
    );
    function createCoverLetter(){
      store.dispatch('rhtModule/createCoverLetter', credentials)
      router.push({name:'cl'})
    }
    function detailCoverLetter(){
      store.dispatch('rhtModule/detailCoverLetter', credentialsTodelete)
      router.push({name:'cl'})
    }

    function deleteCoverLetter(){
      store.dispatch('rhtModule/deleteCoverLetter', credentialsTodelete)
      router.push({name:'cl'})
    }


    function updateCoverLetter(){
      store.dispatch('rhtModule/updateCoverLetter', CoverLetterDetail)
    }

    return {
      credentials, createCoverLetter, deleteCoverLetter, updateCoverLetter, detailCoverLetter,
      CoverLetterList, CoverLetterDetail, credentialsToedit, credentialsTodelete
    }
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
  color : white;
}
a:hover{
  text-decoration: none;
  color : white;
}
.CLMBoss{
  min-width: 1000px;
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
.CLManageView{
  height: 100%;
  width: 80%;
  overflow: scroll;
}
.CLManageView::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}

.pagetitle{
  margin-top: 20px;
}
.clmanageTop{
  margin-top: 20px;
  margin-left: 20px;
  background: white;
  border-radius: 20px;
  width:95%;
  display: flex;
  justify-content: end;
  flex-direction: row;
  align-items: center;
  height: 80px;
}

.clmanageTopitem{
  /* margin-top: 20px; */
  width: 13vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  margin-right:20px;
}
.clmanageTopitem:hover{
  background: #ffcc74;
}

.clSubmit{
  /* margin-top: 20px; */
  width: 6vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #47A0FF;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  padding:0;
  margin:0;

}
.clSubmit:hover{
  background: #89B2E8;
}

.clCancle{
  /* margin-top: 20px; */
  width: 6vw;
  height: 2.5vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
  padding:0;
  margin: 0;

}
.clCancle:hover{
  background: #ffcc74;
}


.clmanageBody{
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 95%;
  height: 80%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  overflow: scroll;
}
.clmanageBody::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
}
.CLContent{
  width: 100%;
  height : 300px;
  white-space:normal;
  margin-top: 10px;
  padding: 0px 20px;
  border: 2px solid #f6f6f6;
  outline: none;
  border-radius: 10px;
  color: #000000;
  background-color: #f6f6f6;
}

.CLTitle{
  width: 100%;
  height : 50px;
  white-space:normal;
  margin-top: 10px;
  padding: 0px 20px;
  border: 2px solid #f6f6f6;
  outline: none;
  border-radius: 10px;
  color: #000000;
  background-color: #f6f6f6;
}
</style>