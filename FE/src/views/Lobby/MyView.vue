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
          <button class="btn btn-primary">정보수정</button>
          <button class="btn btn-danger">회원탈퇴</button>
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
import { computed } from "vue";
export default {
  components:{
    NavBar
  },
  name: "PWUpdateModal",
  setup() {
    const store = useStore();
    const tests = computed(
      () => store.state.rhtModule.test
    );
    const userLists = computed(
      () => store.state.rhtModule.userList
    );
    return {
      tests, userLists
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
</style>

