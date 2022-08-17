<template>
<div class="userVideo" v-if="streamManager && showVid">
	<!-- <div class="userInfo">{{ clientName }}</div> -->
	<ov-video :stream-manager="streamManager"/>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import OvVideo from './OvVideo';
export default {
	name: 'UserVideo',
	components: {
		OvVideo,
	},
	props: {
		streamManager: Object,
	},
	computed: {
		...mapGetters('lbhModule',[
			'WRParticipantList',
			'session',
			'myUserEmail',
		]),
		clientName() {
			const { clientName } = this.getConnectionData();
			return clientName;
		},
		clientEmail() {
			const { clientEmail } = this.getConnectionData();
			return clientEmail;
		},
		showVid() {
			const inWR = this.WRParticipantList.filter(p => p.myUserEmail === this.clientEmail)
    // if(state.currentUserList.length) {
    //   return state.currentUserList.filter(p => p.myUserEmail !== state.myUserEmail)
    // } else return []
			if(this.$router.currentRoute.value.name === 'waiting-room' && (inWR.length === 0)){
				return false
			} else return true
		},
	},
	mounted(){
		console.log()
		console.log('uservideo mounted',this.session, this.streamManager)

		console.log('지금 어디있지?', this.$router.currentRoute.value.name)
		console.log('show this video?',this.videoStatus)
	},
	data(){
		return{
			videoStatus: true,
		}
	},


	methods: {
		getConnectionData () {
			const { connection } = this.streamManager?.stream;
			return JSON.parse(connection.data);
		},
		// async inWR() {
		// 	await this.session.on('signal:publisherOn')
		// 	if(this.streamManager){
		// 		const vidUserEmail = JSON.parse(this.streamManager.stream.connection.data).clientEmail
		// 		if(this.WRParticipantList.filter(e=> e.name === vidUserEmail).length === 0){
		// 			this.videoStatus = false
		// 		} else { 
		// 			this.videoStatus = true}
		// 	} else {this.videoStatus = false}
		// },
	},
};
</script>

<style scoped>
.userVideo{
	display: flex;
	flex-direction: column;
}

.userInfo{
    position: absolute;
    /* justify-content: center; */
    background: #ffffff;
    width: 10%;
	margin-left: 6%;
    color: rgb(0, 0, 0);
    border-radius: 10px;
    padding: 1px;
    text-align: center;
}
</style>