// 임현탁
<template>
  <div id="PWUpdateModal">
    <!-- 이름 -->
    <!-- 이메일 -->
    <!-- 수정할 비밀번호 -->
    <!-- 수정할 비밀번호 확인 -->
    <!-- 수정완료 버튼 -->
    <!-- 취소버튼 -->
    <!-- 수정완료버튼 누르면 확인 컨펌 -->

  </div>
</template>

<script>
export default {
  name: "PWUpdateModal",
  setup() {
    const store = useStore();
    function EndStudyConfirm() {
      if (confirm("정말 스터디를 종료하시겠습니까?")) {
        this.$router.push("/main");
      }
    }
    const participants = computed(
      () => store.state.lbhModule.participantList
    );
    return {
      EndStudyConfirm,
      participants,
    };
  },
};
</script>

<style>
</style>