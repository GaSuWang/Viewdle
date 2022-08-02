// 임현탁
<template>
<div class="CLMBoss">
  <NavBar class="NavView"/>
  <div class="CLManageView">
    <p class="pagetitle">Cover Letter Manage</p>
    <div class='clmanageTop'>
        <div class="dropdown clmanageTopitem">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            정렬
          </button>
          <ul class="dropdown-menu">
            <li>오래된순</li>
            <li>최신순</li>
          </ul>
        </div>
        <button class="btn btn-secondary clmanageTopitem" data-bs-toggle="modal" data-bs-target="#clmaker">자소서생성</button>
    </div>
      <hr>
    <div class="clmanageBody">
      <CLMCard/>
      <CLMCard/>
      <CLMCard/>
      <CLMCard/>
      <CLMCard/>
      <CLMCard/>
    </div>
    </div> 


      <!-- 자소서 생성 모달 -->
      <div class="modal fade" id="clmaker" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">자소서 제목</h5>
              <input type="Text" v-model="credentials.coverLetterTitle" class="form-control form-control-lg" placeholder="Title" /> 
            </div>
            <div class="modal-body">
              <input type="Text" v-model="credentials.coverLetterContent" class="form-control form-control-lg" placeholder="body" /> 
            </div> 
            <div class="modal-footer">
              <button class="btn btn-secondary">작성</button>
              <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 자소서 수정모달 -->
      <div class="modal fade" id="editCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">자소서 제목</h5>
              <input type="Text" v-model="credentials.coverLetterTitle" class="form-control form-control-lg" placeholder="Title" /> 
            </div>
            <div class="modal-body">
              <input type="Text" v-model="credentials.coverLetterContent" class="form-control form-control-lg" placeholder="body" /> 
            </div> 
            <div class="modal-footer">
              <button class="btn btn-secondary">작성</button>
              <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </form>
          </div>
        </div>
      </div> 

      <!-- 자소서 삭제모달  -->
      <div class="modal fade" id="deleteCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="">
              <h5 class="modal-title" id="staticBackdropLabel">정말 삭제 할거야?</h5>
              <button class="btn btn-secondary">Yes</button>
              <button class="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </form>
          </div>
        </div>
      </div>   

    
    <!-- 내 자기소개서 관리 페이지 -->
    <!-- 최신순/오래된순 정렬 -->
    <!-- 전체삭제 버튼-->
    <!-- <button type="button" class="btn">전체 삭제</button> -->

    <!-- 자소서가 하나도 없을 때 보여줄 문구, 이미지 -->

    <!-- 카드 형식의 자기소개서 -->
    <!-- 카드 안에 썸네일(?)이 좌측에, 제목과 생성일이 우측에 위치 -->
    <!-- 카드는 3열, 반응형 설계는 아직... -->
    <!-- <div class="CLM Container" v-for="cl in cls" :key="cl.seq">
      <CLMCard :card="cl"></CLMCard>
    </div> -->
    <!-- 임시로 만든 자소서 카드 대용 버튼 -->
    <!-- <button type="button" class="btn btn-primary" @click="open=true">{{open}}</button> -->
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
      "coverLetterContent":'',
      "coverLetterTitle":''
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

    function getCoverLetter(){
      store.dispatch('rhtModule/getCoverLetter')
      router.push({name:'cl'})
    }

    function deleteCoverLetter(){
      store.dispatch('rhtModule/deleteCoverLetter', credentialsTodelete)
      router.push({name:'cl'})
    }

    function detailCoverLetter(){
      store.dispatch('rhtModule/detailCoverLetter', CoverLetterList.value.coverLetterSeq)
    }

    function updateCoverLetter(){
      store.dispatch('rhtModule/updateCoverLetter', credentialsToedit)
    }

    return {
      credentials, createCoverLetter, getCoverLetter, deleteCoverLetter, detailCoverLetter, updateCoverLetter, 
      CoverLetterList, CoverLetterDetail, credentialsToedit, credentialsTodelete
    }
  }
}
</script>

<style>
.CLMBoss{
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
}
.pagetitle{
  margin-top: 20px;
}
.clmanageTop{
  background: white;
  border-radius: 20px;
  width:98%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
}
.clmanageTopitem{
  margin: 0 20px
}
.clmanageBody{
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 98%;
  height: 80%;
  background: white;
  border-radius: 20px;
  padding: 20px;
  overflow: scroll;
}
</style>