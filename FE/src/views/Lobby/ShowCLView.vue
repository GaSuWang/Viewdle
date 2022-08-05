// 임현탁
<template>
<div>
    <form @submit.prevent="">
        <h5 class="modal-title" id="staticBackdropLabel">자소서 제목</h5>
        <input type="Text" v-model="credentials.coverLetterTitle" class="form-control form-control-lg" placeholder="Title" /> 


        <input type="Text" v-model="credentials.coverLetterContent" class="form-control form-control-lg" placeholder="body" /> 


        <button class="btn btn-secondary">작성</button>
         
    </form>


</div>
</template>

<script>
import {useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { reactive } from 'vue'
export default {
  setup(){
    const credentials =reactive({
      "coverLetterContent":'',
      "coverLetterTitle":''
    })
    const router = useRouter();
    const store = useStore();
    function createCoverLetter(){
      store.dispatch('rhtModule/createCoverLetter', credentials)
      router.push({name:'cl'})
    }

    function getCoverLetter(){
      store.dispatch('rhtModule/getCoverLetter')
      router.push({name:'cl'})
    }

    return {
      credentials, createCoverLetter, getCoverLetter
    }
  }
}
</script>

<style>
</style>


