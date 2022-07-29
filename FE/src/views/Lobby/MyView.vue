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
    <NavBar/>
    <div class="MyView">
      <p>MyPage</p>
      <div class="MyTop">
      </div>
        <hr>
        <div class="MyBody">
          <h5>My Page</h5>
            <img :src="userLists.userProfileImage">
            <p class="card-text">이름 : {{userLists.userName}}</p>
            <p class="card-text">email :{{userLists.userEmail}}</p>
            <div class="bottomplz">
              <div class="card-footer">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editconfirm">정보수정</button>
                <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteconfirm">회원탈퇴</button>
              </div>
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
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <form @submit.prevent="deleteID()">
                    <div v-if="pwcode != false">
                      <button class="btn btn-primary">회원탈퇴하기</button>
                    </div>
                  </form>
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
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <div v-if="pwcodeforedit != false">
                      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editmodal">비번수정모달</button>
                    </div>
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
                  <button class="btn btn-primary">비번바꾸기</button>
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
import { useStore } from 'vuex'
import { computed, reactive } from "vue";
export default {
  components:{
    NavBar
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
  height: 100%;
}
.MyView{
  position:fixed;
  top:50px;
  left: 300px;
  height: 100%;
  width: 80%;
  overflow:scroll;
}
.card{
  width: 98%;
  height: 88%;
}
.card-footer{
  display: flex;
  justify-content: end;
}
.card-footer button{
  margin: 0 20px;
}
.MyBody{
  width: 98%;
  height: 85%;
  background: white;
  border-radius: 20px;
  padding: 20px;
}
</style>

