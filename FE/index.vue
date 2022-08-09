<template>
    <div id="videos">
        <div class="er-video"></div>
        <div class="ers-video"></div>
    </div>
</template>

<script>

var url = new URL(window.location.href);
var SESSION_ID = url.searchParams.get("sessionId");
var SECRET = url.searchParams.get("secret");
var TOKEN = 'wss://' + location.host + '?sessionId=' + SESSION_ID + '&secret=' + SECRET + '&recorder=true';

var OV = new OpenVidu();
var session = OV.initSession();

const ERSArray = []

session.on("streamCreated", (event) => {
    var stream = event.stream
    const userName = JSON.parse(stream.connection.data).clientData
    if(userName === this.EEName){
        session.subscribe(stream, 'ee-video');
    } else {
        session.subscribe(stream, 'ers-video')
    }
});
session.connect(TOKEN)
    .then(() => { console.log('Recorder participant connected') })
    .catch(error => { console.error(error) });

import {mapGetters} from 'vuex'
export default {
name: 'custom-layout',
computed:{
    ...mapGetters('lbhModule',[
        'mySessionId',
        'EE',
        'ERS',  
        'EEName',
        'ERSNameList',
    ])
},
}
</script>
<style scoped>
#videos{
    display: flex;
    flex-direction: column;
}

.ee-video{
    width: 98%;
    height: 78%;
    margin: 1%;
}

.ers-video{
    display: flex;
    justify-content: space-evenly;
    width: 98%;
    height: 18%;
    margin: 1%;
}
</style>