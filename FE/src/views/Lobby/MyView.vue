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
  <div class="MyView">
    <div id="my-page">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">My Page</h5>
          <img src="@/assets/images/anyimgs.png">
          <p class="card-text">이름 : {{ tests.name }}</p>
          <p class="card-text">email : {{ tests.email }}</p>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editconfirm">정보수정</button>
          <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteconfirm">회원탈퇴</button>
        </div>
      </div>
    </div>
    <!-- 회원탈퇴전 비밀번호 모달 -->
          <div class="modal fade" id="deleteconfirm" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="confirmPW(credentials)" id="myDIV">
                  <div class="modal-body">
                    <div class="form-outline mb-4">
                      <input type="password" v-model="credentials.confirmPW" class="form-control form-control-lg" placeholder="Password Confirm" />
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
    <NavBar/>

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
    const store = useStore();
    const tests = computed(
      () => store.state.rhtModule.test
    );
    const userLists = computed(
      () => store.state.rhtModule.userList
    );
    const pwcode = computed(
      () => store.state.rhtModule.pwcode
    )
    function confirmPW(){
      store.dispatch('rhtModule/confirmPW', credentials)
    }
    function deleteID(){
      store.dispatch('rhtModule/deleteID', credentials)
    }
    return {
      tests, userLists, confirmPW, credentials, pwcode, deleteID
    };
  },
};
</script>

<style>
#my-page{
  position: fixed;
  left: 400px;
  top: 50px;
}
.deleteconfirm{
  position: absolute;
  z-index: 9998;
}
</style>

