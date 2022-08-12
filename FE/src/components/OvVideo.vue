<template>
	<video class='input_video' autoplay/>
</template>

<script>
export default {
	name: 'OvVideo',

	props: {
		streamManager: Object,
	},

	data(){
		return{
			model : null,
		}
	},

	async mounted () {
		this.streamManager.addVideoElement(this.$el);
	},
};
</script>

<style scoped>
video{
	width: 100%;
	border-radius: 2%;
	border: 1px rgb(231, 231, 231) solid;
}
</style>
