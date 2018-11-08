<template>
	<div class="hello">
		<x-chart :id="id" :option="option"></x-chart>
	</div>
</template>
<script>
	// 导入chart组件
import XChart from '@/components/charts.vue'
// 导入chart组件模拟数据
import options from '@/chart-options/options'
	export default{
		name:'hello',
		 components: {
 			XChart
 		},
		data(){
			var option = options.bar
			return {
				id:'test',
 				option:option,

			}
		},
		watch:{
    	'$route':function(to,from){
    		
    		this.id=to.params.id; 
    	}
  	},
		mounted(){
			// alert(JSON.stringify(this.$route.params.id))
			 // alert((this.$route.params.id))
			console.log(this.$route);
    		console.log(this.$router);
		},
	}
</script>