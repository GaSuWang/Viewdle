// 임현탁
<template>
  <div class="SendImg">
    <input multiple @change='onInputImage()' ref="serveyImage" type="file">
    <button @click="onClickFormButton()">이미지 변경</button>
    <p>{{credentialsImg.image}}</p>
  </div>

</template>

<script>
import { useStore } from 'vuex'
export default {
    data(){
        return{
            credentialsImg:{
                image:'',
            }
        }   
    },
    methods:{
    onInputImage(){
        this.credentialsImg.image = this.$refs.serveyImage.file
    },
    onClickFormButton(credentialsImg){
        const formdata = new FormData()
        const store = useStore()
        if (credentialsImg.image.length > -1){
            for (let i=0; i< credentialsImg; i++){
                const imageForm = credentialsImg.image[i]

                formdata.append(`profile[${i}]`, imageForm)
            }
            formdata.append('imageCount', credentialsImg.image.length)
        }
        store.dispatch('rhtModule/profileImg', formdata)
    }
    }
};
</script>

<style>
</style>