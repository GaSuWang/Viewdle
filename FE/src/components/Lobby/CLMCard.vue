// 임현탁
<template>
  <div class="CLMCard">
    <div class="CLMCardTop">
    </div>
    <div class="CLMCardBottom">
      <div class="CLMthumnail">
          <img src="@/assets/images/anyimgs.png" class="img-fluid rounded-start">
      </div>
      <div class="CLMcard-body">
        <h5>자소서 제목</h5>
        <p><small class="text-muted">작성 일자</small></p>
      </div>
    </div>
    <div class="CLMcard-button">
      <div class="CLMcard-buttonitem1">
      <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editCL">수정하기</button>
      </div>
      <div class="CLMcard-buttonitem2">
      <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteCL">삭제하기</button>
      </div>
    </div>
    <!-- 좌단 -->
    <!-- 자소서 썸네일? 이미지? 이모티콘? -->
    <!-- 우단 -->
    <!-- 자소서 제목  -->
    <!-- 자소서 생성일  -->
    
  </div>  
</template>

<script>
export default {
  props: {card:Object}

}
</script>

<style>
.CLMCard{
  width:45%;
  height:45%; 
  margin:10px;
  border-radius: 20px;
  align-items: center;
  align-content: center;
  justify-content: center;
  box-shadow: 1px 1px 1px 1px gray;
  transition: all 0.1s linear;
  display: flex;
  flex-flow: column;
}
.CLMCard:hover {
  transform:scale(1.04);
}
.CLMCardTop{
  width:100%;
  height: 30px;
  display:flex;
  justify-content: end;
  margin-right: 30px
}
.CLMCardBottom{
  width: 100%;
  display:flex;
}
.CLMthumnail{
  margin:20px;
  width:40%;
  display:flex;
  justify-content: center;
}
.CLMcard-body{
  width: 60%;
  display: flex;
  flex-flow: column;
}
.CLMcard-button{
  width:100%;
  display: flex;
  justify-content: end;
  align-content: end;
  margin-right: 20%;
}
.CLMcard-buttonitem1{
  margin-right:10px;
}
.CLMcard-buttonitem2{
  margin-left:10px;
}
</style>