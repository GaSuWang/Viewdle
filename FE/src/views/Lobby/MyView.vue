// 임현탁
<template>
    <!-- 프로필사진 클릭시 수정가능 -->
    <!-- 회원정보수정 버튼 누르면 비밀번호 확인 -->
    <!-- 이용추이 그래프, 잔디형식으로 보여주기 -->
  <div class="MyView">
    <p id="my-page">
      My Page
    </p>
    <NavBar/> 
  </div>
</template>

<script>
import NavBar from '@/components/Lobby/NavBar.vue'
export default {
  components:{
    NavBar
  }
}
</script>

<style>
#my-page{
  position: fixed;
  left: 400px;
  top: 50px;
}
</style>

