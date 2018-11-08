<template>
	<div class="customer">
		顾客{{id}}
	</div>
</template>
<script>
	export default {
		data(){
			return {
				id:0
			}
		},
		mounted(){
			// this.$route.params
			// alert(JSON.stringify(this.$route.params.id))
			console.log(this.$route);
			console.log(this.$router);

			this.id = this.$route.params.id;
		},
        watch:{
            '$route':function(to,from){
                console.log('to:',to);
                this.id = to.params.id
            }
        }
	}
</script>