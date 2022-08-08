// 임현탁
<template>
<div class="CLMBoss">
  <NavBar class="NavView"/>
  <div class="CLManageView">
    <p class="pagetitle">Cover Letter Manage</p>
    <div class='clmanageTop'>
        <button class="btn btn-secondary clmanageTopitem" data-bs-toggle="modal" data-bs-target="#clmaker">자소서생성</button>
        <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editCL">수정하기</button>
        <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteCL">삭제하기</button>
        <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#detailCL">상세보기</button>
    </div>
      <hr>
    <div class="clmanageBody">
      <CLMCard/>  
    </div>
    </div> 


      <!-- 자소서 생성 모달 -->
      <div class="modal fade" id="clmaker" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="createCoverLetter(credentials)">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">자소서 제목</h5>
              <input type="Text" v-model="credentials.coverLetterTitle" class="form-control form-control-lg" placeholder="Title" /> 
            </div>
            <div class="modal-body">
              <input type="Text" v-model="credentials.coverLetterContent" class="form-control form-control-lg" placeholder="body" /> 
            </div> 
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">작성</button>
            </div>
            </form>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>

      <!-- 자소서 수정모달 -->
      <div class="modal fade" id="editCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="updateCoverLetter(credentialsToedit)">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">자소서 제목</h5>
              <input type="Text" v-model="credentials.coverLetterTitle" class="form-control form-control-lg" placeholder="Title" /> 
            </div>
            <div class="modal-body">
              <input type="Text" v-model="credentials.coverLetterContent" class="form-control form-control-lg" placeholder="body" /> 
            </div> 
            <div class="modal-footer">
              <input type="number" v-model="credentialsToedit.coverLetterSeq">
              <button class="btn btn-secondary" data-bs-dismiss="modal">작성</button>
            </div>
            </form>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div> 

      <!-- 자소서 삭제모달  -->
      <div class="modal fade" id="deleteCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="deleteCoverLetter(credentialsTodelete)">
              <h5 class="modal-title" id="staticBackdropLabel">정말 삭제 할거야?</h5>
              <input type="number" v-model="credentialsTodelete.coverLetterSeq">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Yes</button>
            </form>
            <button class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          </div>
        </div>
      </div>   

      <!-- 상세모달 -->
      <div class="modal fade" id="detailCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="detailCoverLetter(credentialsTodelete)">
              <h5 class="modal-title" id="staticBackdropLabel">어떤거 볼래?</h5>
              <input type="number" v-model="credentialsTodelete.coverLetterSeq">
              <button class="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#detailofCL">Yes</button>
            </form>
            <button class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          </div>
        </div>
      </div>   


      <div class="modal fade" id="detailofCL" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <h5 class="modal-title" id="staticBackdropLabel">{{CoverLetterDetail.coverLetterTitle}}</h5>
            {{CoverLetterDetail.coverLetterContent}}
            <button class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
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
      store.dispatch('rhtModule/updateCoverLetter', credentialsToedit)
    }

    return {
      credentials, createCoverLetter, deleteCoverLetter, updateCoverLetter, detailCoverLetter,
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
  justify-content: end;
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