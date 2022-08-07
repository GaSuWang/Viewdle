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
			'superUser'
		]),
		clientData () {
			const { clientData } = this.getConnectionData();
			return clientData;
		},
	},

	methods: {
		getConnectionData () {
			const { connection } = this.streamManager.stream;
			return JSON.parse(connection.data);
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