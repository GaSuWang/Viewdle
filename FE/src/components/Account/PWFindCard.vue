// 임현탁
<template>
<section class="vh-100">
  <div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img id="logoimg" src="@/assets/images/anyimgs.png"
          class="img-fluid" alt="Sample image">
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <div id="PWFindCard">
        <!-- 이메일 입력란 -->
        <!-- 버튼클릭시 이메일로 임의의 비밀번호 발송 or 원래비밀번호 발송 -->
        <!-- 취소버튼 -->
        <!-- 확인되지 않은 이메일 일 시 알람 -->
        <!-- 이메일 인풋 -->
          <form @submit.prevent="findPW(credentials)">
            <div class="form-outline mb-4">
              <input type="email" v-model="credentials.userEmail" class="form-control form-control-lg" placeholder="Email address" />
              <button class="btn btn-primary btn-lg">찾기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

</template>

<script>
import { useStore } from 'vuex'
import { reactive } from 'vue'
export default {
  name: 'PWFindCard',
  setup () {
    const credentials = reactive({
      userEmail: '',
    })

    const store = useStore()
    function findPW(){
      store.dispatch('rhtModule/findPW', credentials)
    }
      
    return {
      findPW, credentials
    }
  }
} 
</script>

<style>
</style>
