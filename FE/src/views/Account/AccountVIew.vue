// 임현탁
<template>
  <div id="AccountView">
  <!-- 상단 -->
  <!-- 로고 -->

  <!-- 중 하단 -->
  <!-- 각 상황마다 컴포넌트 -->
    <LoginCard/>
  </div>
</template>

<script>
import LoginCard from '@/components/Account/LoginCard.vue'
export default {
  components:{
    LoginCard
  }
}
</script>

<style>
</style>
