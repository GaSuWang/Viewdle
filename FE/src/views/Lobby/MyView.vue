// 임현탁
<template>
    <!-- 프로필사진 클릭시 수정가능 -->
    <!-- 회원정보수정 버튼 누르면 비밀번호 확인 -->
    <!-- 이용추이 그래프, 잔디형식으로 보여주기 -->
    <!-- 이름 -->
    <!-- 이메일 -->
    <!-- 수정할 비밀번호 -->
    <!-- 수정할 비밀번호 확인 -->
    <!-- 수정완료 버튼 -->
    <!-- 취소버튼 -->
    <!-- 수정완료버튼 누르면 확인 컨펌 -->
  <div class="MyViewBoss">
    <NavBar class="NavView"/>
    <div class="MyView">
      <div class="MyBody">
        <div class="card-top">
          <div class="card-topitem1">
            <div class="card-topitem1-img">
              <img :src="userLists.userProfileImage">
            </div>
            <div class="card-topitem1-2">
              <div class="card-topitem1-ptag">
                <p class="card-text" style="font-size : 20px;">이름 : {{userLists.userName}}</p>
                <p class="card-text" style="font-size : 20px">이메일 :{{userLists.userEmail}}</p>
              </div>
              <div class="card-topitem1-sendimg">
                <SendImg/>
              </div>
            </div>
          </div>
          <div class="card-topitem2">
          </div>
        </div>
        <div class="Mycard-body">
          <UsageTrend/>
          <GrassShow/>
        </div>
        <div class="card-body2">
          <BadgeList style="width:95%"></BadgeList>
        </div>
        <div class="card-footer">
          <button class="deleteSubmit" data-bs-toggle="modal" data-bs-target="#deleteconfirm">회원 탈퇴</button>
          <button class="modifySubmit" data-bs-toggle="modal" data-bs-target="#editconfirm">정보 수정</button>
        </div>
      </div>
    </div>






    <!-- 회원탈퇴전 비밀번호 모달 -->
          <div class="modal fade" id="deleteconfirm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="confirmPW(credentials)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="credentials.password" class="form-control form-control-lg" placeholder="비밀번호 확인" />
                    </div>
                  </div>
                  <div v-if="pwcode != false">
                  <button class="deleteSubmit1" style="width:10vw">비밀번호 확인</button>
                  </div>
                </form>
                <div class="modal-footer">
                  <form @submit.prevent="deleteID()">
                    <div v-if="pwcode == false">
                      <button class="deleteSubmit" style="width:10vw" data-bs-dismiss="modal">회원탈퇴하기</button>
                    </div>
                  </form>
                     <button type="button" @click.prevent="empty()" class="modifySubmit" data-bs-dismiss="modal">취소</button>
                </div>
              </div>
            </div>
          </div>    






      <!-- 수정 전 확인 모달  -->
      <div class="modal fade" id="editconfirm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  
                </div>
                <form @submit.prevent="confirmPWforEdit(credentials)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="credentials.password" class="form-control form-control-lg" placeholder="비밀번호 확인" />
                    </div>
                 <div v-if="pwcodeforedit != false">
                  <button class="deleteSubmit1" style="width:10vw">비밀번호 확인</button>
                  </div>
                  </div>
                </form>
                <div class="modal-footer">
                    <div v-if="pwcodeforedit == false">
                      <button class="deleteSubmit" style="width:8vw" data-bs-toggle="modal" data-bs-target="#editmodal">비밀번호 수정</button>
                    </div>
                     <button type="button" @click.prevent="empty()" class="modifySubmit" data-bs-dismiss="modal">취소</button>
                </div>
              </div>
            </div>
          </div>  







      <!-- 수정 모달 -->
         <div class="modal fade" id="editmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="changePW(changepassword)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="changepassword.password" class="form-control form-control-lg" placeholder="New Password" />
                      <input type="password" v-model="changepassword.password2" class="form-control form-control-lg" placeholder="Check New Password" />
                    </div>
                  </div>
                  <div class="modal-footer">
                  <button class="deleteSubmit" style="width:8vw" data-bs-dismiss="modal">비밀번호 수정</button>
                  <button class="modifySubmit" @click.prevent="empty()" data-bs-dismiss="modal"><router-link to="/mypage">취소</router-link></button>
                  </div>
                </form>
              </div>
            </div>
          </div>  


    <!-- <div id="my-page">
      {{ participants }}
    </div> -->
  </div>
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
import UsageTrend from '@/components/Lobby/UsageTrend.vue'
import BadgeList from '@/components/Lobby/BadgeList.vue'
import GrassShow from '@/components/Lobby/GrassShow.vue'
import SendImg from '@/components/Lobby/SendImg.vue'
import { useStore } from 'vuex'
import { computed, reactive } from "vue";
export default {
  components:{
    NavBar,
    UsageTrend,
    BadgeList,
    GrassShow,
    SendImg,
  },
  name: "PWUpdateModal",
  setup() {
    const credentials = reactive({
      password: '',
    })
    const changepassword = reactive({
      password: '',
      password2: ''
    })
    const store = useStore();
    const userLists = computed(
      () => store.state.rhtModule.UserList
    );
    const pwcode = computed(
      () => store.state.rhtModule.pwcode
    )
    const pwcodeforedit = computed(
      () => store.state.rhtModule.pwcodeforedit
    )
    function confirmPW(){
      store.dispatch('rhtModule/confirmPW', credentials)
    }
    function confirmPWforEdit(){
      store.dispatch('rhtModule/confirmPWforEdit', credentials)
    }
    function deleteID(){
      store.dispatch('rhtModule/deleteID', credentials)
    }
    function changePW(){
      store.dispatch('rhtModule/changePW', changepassword)
    }
    function empty(){
      credentials.password=''
    store.commit('rhtModule/SET_PW_CODE', true)
    store.commit('rhtModule/SET_PW_CODE_FOR_EDIT', true)
    }
    return {
      userLists, confirmPW, credentials, pwcode, deleteID, confirmPWforEdit, pwcodeforedit, changePW, changepassword,empty
    };
  },
};
</script>

<style>
.MyViewBoss{
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
  display:flex;

}
.pagetitle{
  margin-top: 20px;
}
.MyView{
  top:50px;
  left: 300px;
  height: 100%;
  width: 80%;
  margin-top:20px;
}
.Mycard-body{
  width:98%;
  height: 48%;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: space-between;
}
.card-body2{
  width: 97%;
  height: 18%;
  display: flex;
  margin: none;
  justify-content: center;
  margin-left:0.5%;
}
.card{
  width: 98%;
  height: 88%;
}
.card-footer{
  display: flex;
  justify-content: end;
  height: 6%;
}
.card-footer button{
  margin: 0 20px;
}
.MyBody{
  margin-left:20px;
  width: 95%;
  height: 95%;
  background: white;
  border-radius: 20px;
  padding: 20px;
}
.card-top{
  width:90%;
  height:25%; 
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: space-around;
  margin-left: 5%;
}
.card-topitem1{
  width: 70%;
  height: 100%;
  display:flex;
  flex-flow:row;
}
.card-topitem2{
  width: 30%;
  height: 100%;
}
.profileimg{
  width: 150px;
  height: 150px;
}
.cardfooterbutton{
  background-color: rgb(230,198,132);
  color: white;
}
.deleteSubmit{
  /* margin-top: 20px; */
  width: 8vw;
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
}
.deleteSubmit1{
  /* margin-top: 20px; */
  width: 8vw;
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
  margin-left:66%;
  margin-bottom:20px;
}
.deleteSubmit:hover{
  background: #ffcc74;
}

.modifySubmit{
  /* margin-top: 20px; */
  width: 8vw;
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
}
.modifySubmit:hover{
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
.card-topitem1-img img{
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.card-topitem1-2{
  width:100%;
  display:flex;
  flex-flow: column;
}
.card-topitem1-ptag{
  display:flex;
  flex-flow: column;
}
.card-topitem1-sendimg{
  margin-top:16px;
  display:flex;
  flex-flow: row;
}
</style>

