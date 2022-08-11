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
      <p class="pagetitle">My Page</p>
      <div class="MyBody">
        <div class="card-top">
          <div class="card-topitem1">
            <!-- <img :src="userLists.userProfileImage"> -->
            <img class="profileimg" src="@/assets/images/anyimgs.png">
            <SendImg/>
          </div>
          <div class="card-topitem2">
            <p class="card-text">이름 : {{userLists.userName}}</p>
            <p class="card-text">email :{{userLists.userEmail}}</p>
          </div>
        </div>
        <div class="Mycard-body">
          <UsageTrend/>
          <GrassShow/>
        </div>
        <div class="card-body2">
          <BadgeList/>
        </div>
        <div class="card-footer">
          <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editconfirm">정보수정</button>
          <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteconfirm">회원탈퇴</button>
        </div>
      </div>
    </div>






    <!-- 회원탈퇴전 비밀번호 모달 -->
          <div class="modal fade" id="deleteconfirm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">비밀번호 확인</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="confirmPW(credentials)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="credentials.password" class="form-control form-control-lg" placeholder="Password Confirm" />
                    </div>
                  </div>
                  <button class="btn btn-primary">비번확인하기</button>
                </form>
                <div class="modal-footer">
                  <form @submit.prevent="deleteID()">
                    <div v-if="pwcode == true">
                      <button class="btn btn-primary" data-bs-dismiss="modal">회원탈퇴하기</button>
                    </div>
                  </form>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>    






      <!-- 수정 전 확인 모달  -->
      <div class="modal fade" id="editconfirm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">비밀번호 확인</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="confirmPWforEdit(credentials)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="credentials.password" class="form-control form-control-lg" placeholder="Password Confirm" />
                    </div>
                  </div>
                  <button class="btn btn-primary">비번확인하기</button>
                </form>
                {{pwcodeforedit}}
                <div class="modal-footer">
                    <div v-if="pwcodeforedit == true">
                      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editmodal">비번수정모달</button>
                    </div>
                     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>  







      <!-- 수정 모달 -->
         <div class="modal fade" id="editmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">비번 수정</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="changePW(changepassword)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="changepassword.password" class="form-control form-control-lg" placeholder="Password Confirm" />
                      <input type="password" v-model="changepassword.password2" class="form-control form-control-lg" placeholder="New Password Confirm" />
                    </div>
                  </div>
                  <button class="btn btn-primary" data-bs-dismiss="modal">비번바꾸기</button>
                </form>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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


    return {
      userLists, confirmPW, credentials, pwcode, deleteID, confirmPWforEdit, pwcodeforedit, changePW, changepassword
    };
  },
};
</script>

<style>
.MyViewBoss{
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
.pagetitle{
  margin-top: 20px;
}
.MyView{
  top:50px;
  left: 300px;
  height: 100%;
  width: 80%;
}
.Mycard-body{
  width:95%;
  height: 48%;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: space-around;
  margin: 0 20px;
}
.card-body2{
  width: 98%;
  height: 18%;
  display: flex;
  margin: 0 20px;
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
  width: 98%;
  height: 90%;
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
  width: 50%;
  height: 100%;
  display:flex;
  flex-flow:row;
}
.card-topitem2{
  width: 50%;
  height: 100%;
}
.profileimg{
  width: 150px;
  height: 150px;
}
</style>

