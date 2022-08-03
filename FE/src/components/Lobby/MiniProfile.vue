// 임현탁
<template>
    <div class="MiniProfile">
        <div class="MiniProfileItem1">
        <img class="MiniProfileImg" :src="UserList.userProfileImage"/>
        </div>
        <div class="MiniProfileItem2">
        <img class="MiniProfileBadge" :src="UserList.userMainBadge"/>
        <div class="MiniProfileUserName">{{UserList.userName}}</div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  setup(){
    const store = useStore()
    const UserList = computed(
      () => store.state.rhtModule.UserList
    );
    return{
      UserList
    }
  }
}
</script>

<style>
.MiniProfile{
    display:flex;
    flex-flow: row;
}
.MiniProfileItem1{

}
.MiniProfileItem2{
    
}
.MiniProfileImg{

    border-radius: 70%;
    overflow: hidden;
}
.MiniProfileBadge{
    width:30px;
    height:30px;
    border-radius: 70%;
    overflow: hidden;
}
.MiniProfileUserName{
    color:white;
}
</style>