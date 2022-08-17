// 임현탁
<template>
  <div class="CLMCard" v-for="item in CoverLetterList" :key="item.seq">
      <form @submit.prevent="detailCoverLetter(item.coverLetterSeq)">
        <button class="btn coverletterbutton1" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#detailofCL">상세보기</button>
      </form>
    <div class="CLMCardTop">
    </div>
    <div class="CLMCardBottom">
      <div class="CLMcard-body">
        <h5>{{item.coverLetterTitle}}</h5>
        <p><small class="text-muted">작성 일시 : {{item.coverLetterRegTime}}</small></p>
        <!-- <p><small class="text-muted">자소서 코드: {{item.coverLetterSeq}}</small></p> -->
      </div>
    </div>
    <div class="CLMfooter">
        <form @submit.prevent="deleteCoverLetter(item.coverLetterSeq)">
          <button class="clCancle" @click.prevent data-bs-dismiss="modal"><router-link to="/cl">삭제</router-link></button>
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
  },
  methods : {

  }
}

</script>

<style>
.CLMCard{
  width:45%;
  height:45%; 
  margin:10px;
  border-radius: 20px;
  /* align-items: center; */
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
.coverletterbutton{
  margin : 3px;
  font-size: 3px;
  background-color:#FEAA00;
  color: white;
}
.coverletterbutton1{
  position:fixed;
  width:100%;
  height: 80%;
  margin : 3px;
  font-size: 3px;
  opacity:0;
}
.clCancle{
  /* margin-top: 20px; */
  width: 3vw;
  height: 2vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #FEAA00;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.clCancle:hover{
  background: #ffcc74;
}

.clSubmit{
  /* margin-top: 20px; */
  width: 3vw;
  height: 2vw;
  border: 0;
  outline: none;
  border-radius: 10px;
  background: #47A0FF;
  color: white;
  font-weight: bold;
  font-size: 1.2em;
  letter-spacing: 2px;
  box-shadow: 0px 1.5px 4px #aaa, inset 0px 1px 1.5px #fff;
}
.clSubmit:hover{
  background: #89B2E8;
}
a{
  text-decoration: none;
  color : white;
}
a:hover{
  text-decoration: none;
  color : white;
}
.CLMfooter{
  display: flex;
  justify-content: end;
  margin-right:20px
}
</style>