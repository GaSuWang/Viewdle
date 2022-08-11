<template>
<div class="userVideo" v-if="streamManager">
	<ov-video :stream-manager="streamManager"/>
	<div class="userInfo">{{ clientData }}</div>
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
		]),
		clientData() {
			const { clientData } = this.getConnectionData();
			return clientData;
		},
		showVid() {
			if(this.$router.currentRoute.value.name === 'waiting-room'){
				if(this.videoStatus===true){return true
				} else {return false}
			} else {return true}
		},
	},
	mounted(){
		console.log()
		this.inWR()
		// this.session.on('signal:publisherOn',()=>{
		// })
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
			const { connection } = this.streamManager.stream;
			return JSON.parse(connection.data);
		},
		async inWR() {
			await this.session.on('signal:publisherOn')
			if(this.streamManager){
				const vidUserName = JSON.parse(this.streamManager.stream.connection.data).clientData
				if(this.WRParticipantList.filter(e=> e.name === vidUserName).length === 0){
					this.videoStatus = false
				} else { 
					this.videoStatus = true}
			} else {this.videoStatus = false}
		},
	},
};
</script>

<style scoped>
.userVideo{
	display: flex;
	flex-direction: column;
}

.userInfo{
	display: flex;
	justify-content: center;
}
</style>