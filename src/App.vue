<template>
    <div class="app">
        <div class="header">
            <div class="title">
                <img src="./assets/kandianzixun.png" alt="">
                看点资讯管理
            </div>
            <div class="user">
                <img :src="user.userface" alt="">
                <div class="user-info">
                    <el-dropdown  @command="handleCommand">
                      <span class="el-dropdown-link">
                        {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item command="logout">退出</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="left_nav">
                <ul>
                    <li :class="{current:currentRoute == '/'}">
                        <i class="fa fa-ravelry"></i>
                        <router-link to='/'>
                            欢迎页面
                        </router-link>
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li :class="{current:currentRoute == '/category'}">
                        <i class="fa fa-align-justify"></i>
                        <router-link to='/category'>
                            栏目管理
                        </router-link> 
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li :class="{current:currentRoute == '/article'}">
                        <i class="fa fa-columns"></i>
                        <!-- <router-link to='/article'>
                            文章管理
                        </router-link> -->
                        <a href="javascript:void(0)" @click="toArticle('/article')">文章管理</a>
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li :class="{current:currentRoute == '/user'}">
                        <i class="fa fa-user-o"></i>
                        <router-link to='/user'>
                            用户管理
                        </router-link>
                        <i class="fa fa-angle-right"></i>
                    </li>
                    <li :class="{current:currentRoute == '/exam'}">
                        <i class="fa fa-mortar-board"></i>
                        <router-link to='/exam'>
                            考试管理
                        </router-link>
                        <i class="fa fa-angle-right"></i>
                    </li>
                </ul>
            </div>
            <div class="right_content">
                <div class="wrapper">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from '@/http/axios'
    export default {
        data(){
            return {
                currentRoute:'/',
                user:{}
            }
        },
        methods:{
            toArticle(url){
                this.$router.push(url)
            },
            handleCommand(command){
                if(command == 'logout'){
                    axios.get('/logout')
                    .then(()=>{
                        localStorage.removeItem('user')
                    })
                }
            }
        },
        watch:{
            '$route':function(to,from){
                // console.log(to);
                this.currentRoute = to.path;
            }
        },
        created(){
            // 处理路由默认显示
            this.currentRoute = this.$route.path
            // 处理用户登录
            let user = JSON.parse(localStorage.getItem('user'))
            if(user){
                this.user = user
            }else{
                window.vm.currentComponent = 'Login'
            }
        }
    }
</script>
<style>
    input:-webkit-autofill {
        -webkit-box-shadow:0 0 0px 1000px white inset !important;
    }
    html {
        font: normal normal 12px '微软雅黑','Microsoft YaHei';
        color: #666;
    }
    body,ul,ol,dl,p,h1,h2,h3 {
        margin: 0;
        padding: 0;
    }
    ul,ol {
        list-style: none;
    }
    a {
        color: #666;
        text-decoration: none;
    }
    div {
        box-sizing: border-box;
    }
    .header {
        position: absolute;
        width: 100%;
        height: 60px;
        top: 0;
        background-color: #44a1dc;
        line-height: 60px; 
    }
    .header .title {
        margin: 0 2em;
        color: #ffffff;
        font-size: 24px;
        float: left;
    }
    .header .user {
        text-align: right;
    }
    .header .user img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 10px;
        margin-right: .8em;
    }
    .header .user .user-info {
        float: right;
    }
    .header .user .user-info .el-dropdown-link {
        color: #fff;
    }
    .content {
        position: absolute;
        width: 100%;
        top: 60px;
        bottom: 0;
    }
    .content .left_nav {
        width: 180px;
        height: 100%;
        float: left;
        background-color: #f5fbfb;
    }
    .content .left_nav ul {

    }
    .content .left_nav ul li {
        line-height: 3em;
        text-align: center;
        border-bottom: 1px solid #ededed;
        position: relative;
    }
    .content .left_nav ul li.current{
        background-color: #f0f0f0;
    }
    .content .left_nav ul li > i:first-child {
        position: absolute;
        font-size: 1em;
        top: 1em;
        left: 2.5em;
    }
    .content .left_nav ul li > i:last-child {
        position: absolute;
        font-size: 1em;
        top: 1em;
        right: 2.5em;
    }
    .content .right_content {
        box-sizing: border-box;
        margin-left: 180px;
        height: 100%;
        background-color: #f0f0f0;
        padding: .5em
    }
    .content .right_content .wrapper {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        background-color: #fff;
        padding: 10px;
        overflow-y: auto;
    }
</style>