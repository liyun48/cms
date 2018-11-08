<template>
	<div class="login">
		<h2 class="title">看点资讯精选后台管理系统</h2>
		<el-form :model="form" :rules='reles' ref="userForm" label-width="5em" size="mini" label-position="left">
		  <el-form-item label="用户名" prop="username" width="120">
		    <el-input v-model="form.username"></el-input>
		  </el-form-item>
		  <el-form-item label="密码" prop="password">
		    <el-input v-model="form.password" type="password"></el-input>
		  </el-form-item>
		</el-form>
		<div class="btn">
			 <el-button @click="login" size="mini">登录</el-button>
		</div>
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return {
				form:{},
				reles:{
					username:[{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password:[{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods:{
			login(){
				this.$refs.userForm.validate((valid)=>{
					if(valid){
						axios.post('/login',this.form)
						.then(({data:result})=>{
							if(result.status == 200 && result.message == '登录成功'){
								console.log(result);
								// 登录成功的处理
								// 1. 页面跳转
								// this.$parent.currentComponent = 'App'
								// this.$root.currentComponent = 'App'
								window.vm.currentComponent = 'App';
								// 2. 用户信息的保存
								localStorage.setItem('user',JSON.stringify(result.data))
							}
						})
						.catch((error)=>{
							this.$notify.error({
								title:'错误',
								message:'网络异常'
							})
						})
					}
				})
			}
		}
	}
</script>
<style>
	body {
		background-image: url('./assets/denglubj.jpg');
	}
	.login {
		background-color: #fff;
		width: 400px;
		margin: 0 auto;
		margin-top: 170px;
		padding: 4em;
	}
	.login .title {
		margin-bottom: 30px;
		text-align: center;
	}
	.login .btn {
		margin-top: 4em;
		text-align: right;
	}
</style>