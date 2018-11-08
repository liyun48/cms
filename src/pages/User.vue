<template>
    <div class="vue">
        <!-- 表格 -->
        <el-table :data="users" style="width: 100%" @selection-change="handleSelectionChange" class='table' size='mini' border height='500'>
            <el-table-column prop="username" label="用户名" width="180"></el-table-column>
            <el-table-column prop="nickname" label="真实姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="regTime" label="注册时间"></el-table-column>
        </el-table>
    </div>
</template>
<script>
    import axios from '@/http/axios'
    export default {
        data(){
            return {
                users:[],
                multipleSelection: []
            }
        },
        methods:{
            // 加载数据
            loadAllUsers(){
                axios.get('/manager/user/findAllUser')
                .then(({data:result})=>{
                    console.log(result)
                    this.users = result.data;
                }).catch((error)=>{
                    console.log(error);
                })
            },
            // 多选框获取id
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        },
        created(){
            this.loadAllUsers()
        }
    }
</script>
<style>
	.table{
		margin-top: 10px;
	}
</style>
