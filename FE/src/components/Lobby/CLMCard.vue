// 임현탁
<template>
  <div class="CLMCard" v-for="item in CoverLetterList" :key="item.seq">
    <div class="CLMCardTop">
    </div>
    <div class="CLMCardBottom">
      <div class="CLMthumnail">
          <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
      </div>
      <div class="CLMcard-body">
        <h5>{{item.coverLetterTitle}}</h5>
        <p><small class="text-muted">{{item.coverLetterRegTime}}</small></p>
        <p><small class="text-muted">자소서 코드: {{item.coverLetterSeq}}</small></p>
      </div>
      <form @submit.prevent="detailCoverLetter(item.coverLetterSeq)">
        <button class="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#detailofCL">상세보기</button>
      </form>
      <form @submit.prevent="deleteCoverLetter(item.coverLetterSeq)">
      <button class="btn btn-secondary">삭제하기</button>
      </form>
    </div>

  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed} from 'vue'
export default {
  setup(){
    const store = useStore()
    const CoverLetterList = computed(
      () => store.state.rhtModule.CoverLetterList
    );
    const CoverLetterDetail = computed(
      () => store.state.rhtModule.CoverLetterDetail
    );
    function detailCoverLetter(credentialsTodelete){
      console.log('hi')
      console.log(credentialsTodelete)
      store.dispatch('rhtModule/detailCoverLetter', credentialsTodelete)
    }
    function deleteCoverLetter(credentialsTodelete){
      if(confirm("정말 삭제 하시겠습니까?")){
        store.dispatch('rhtModule/deleteCoverLetter', credentialsTodelete)
      } else{
        alert("삭제가 취소되었습니다.")
      }
    }
    return {
      CoverLetterList, CoverLetterDetail, detailCoverLetter, deleteCoverLetter
    }
  }
}

</script>

<style>
.CLMCard{
  width:45%;
  height:45%; 
  margin:10px;
  border-radius: 20px;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: 1px 1px 1px 1px gray;
  transition: all 0.1s linear;
  display: flex;
  flex-flow: column;
  
}
.CLMCard:hover {
  transform:scale(1.04);
}
.CLMCardTop{
  width:100%;
  height: 10%;
  display:flex;
  justify-content: end;
  margin-right: 30px
}
.CLMCardBottom{
  width: 100%;
  height: 80%;
  display:flex;
}
.CLMthumnail{
  margin:20px;
  width:40%;
  display:flex;
  justify-content: center;
}
.CLMcard-body{
  width: 60%;
  display: flex;
  flex-flow: column;
}
.CLMcard-button{
  width:100%;
  height: 10%;
  display: flex;
  justify-content: end;
  align-content: end;
  margin-right: 20%;
}
.CLMcard-buttonitem1{
  margin-left:10px;
}
.CLMcard-buttonitem2{
  margin-left:10px;
}
.CLMcard-buttonitem3{
  margin-left:10px;
}
</style>