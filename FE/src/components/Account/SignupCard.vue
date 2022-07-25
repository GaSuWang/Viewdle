// 임현탁
<template>
  <div class="container" id="SignupCard">
    <!-- 이름 -->
    <!-- 이메일 -->
    <!-- 비밀번호 -->
    <!-- 비밀번호 확인 -->
    <!-- 가입완료 버튼  and 취소버튼-->
    <!-- 가입 실패시 알람 -->
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form>
          <!-- 이름 -->
          <div class="form-outline mb-4">
            <input type="email" id="form3Example3" class="form-control form-control-lg"
              placeholder="Nick Name" />
          </div>
          <!-- 이메일 인풋 -->
          <div class="form-outline mb-4">
            <input type="email" id="form3Example3" class="form-control form-control-lg"
              placeholder="Email address" />
          </div>

          <!-- 비번 인풋 -->
          <div class="form-outline mb-3">
            <input type="password" id="form3Example4" class="form-control form-control-lg"
              placeholder="Password" />
          </div>

          <!-- 비번 확인 인풋 -->
          <div class="form-outline mb-3">
            <input type="password" id="form3Example4" class="form-control form-control-lg"
              placeholder="Password Check" />
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="button" class="btn btn-primary btn-lg"
              style="padding-left: 2.5rem; padding-right: 2.5rem;">가입완료</button>
          </div>

        </form>
      </div>
  </div>
</template>

<script>
</script>

<style>
</style>