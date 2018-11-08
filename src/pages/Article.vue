<template>
	<div class="article">
		<!-- 按钮区 -->
		<div class="btns">
			<!-- 栏目信息 -->
			<el-select v-model="params.categoryId" clearable placeholder="所有栏目" size="mini">
		    	<el-option v-for="c in categories" :key="c.id" :value="c.id" :label="c.name">
		    	</el-option>
		  	</el-select>
		  	<el-input
  			placeholder="请输入关键字"
  			size='mini'
  			style="width:130px"
  			v-model="params.keywords"
  			clearable>
			</el-input>
		  	<!-- 按钮 -->
			<el-button size='mini' @click="toAddArticle">新增</el-button>
			<el-button size='mini' @click="batchDeleteArticle">批量删除</el-button>
		</div>

		<!-- 列表区 -->
		<div class="article_table" v-loading="loading">
			<el-table :data="articles" border style="width: 100%" size='mini' @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="38" fixed="left">
  				</el-table-column>
  				<el-table-column prop="title" label="文章标题" width="300">
  				</el-table-column>
		   		<el-table-column prop="category.name" label="所属栏目" width="160" align="center">
		   		</el-table-column>
		   		<el-table-column prop="liststyle" label="列表样式" width="160" align="center">
		   		</el-table-column>
		   		<el-table-column prop="author" label="作者" width="160" align="center">
		   		</el-table-column>
		   		<el-table-column prop="publishtime" label="发布时间" width="160" align="center">
		   		</el-table-column>
		   		<el-table-column prop="readtimes" label="阅读次数" width="110" align="center">
		   		</el-table-column>
		    	<el-table-column label="操作" width='60' fixed="right">
		    		<template slot-scope='{row}'>
		    			<i class="fa fa-pencil" @click="toUpdateArticle(row)"></i>
		    			<i class="fa fa-trash" @click="deleteArticle(row.id)"></i>
		    		</template>
		    	</el-table-column>
			</el-table>
		</div>

		<!-- 分页 -->
		<div class="page">
			<el-pagination
    		layout="prev, pager, next"
    		:page-size='params.pageSize'
    		:total="total"
    		@current-change='handleCurrentChange'>
  			</el-pagination>
		</div>

		<!-- 模态框 -->
		<el-dialog :title="articleDialog.title" :visible.sync="articleDialog.visible" fullscreen>
			<!-- {{articleDialog.form}} -->
		  <el-form :model="articleDialog.form" size="mini" label-position="left" >
		    <el-form-item label="文章标题" label-width="6em">
		      <el-input v-model="articleDialog.form.title" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-row>
  				<el-col :span="12">
  					<el-form-item label="列表样式" label-width="6em">
				      <ul class="list_style">
				      	<li class="style_one" :class="{current:articleDialog.form.liststyle=='style-one'}" @click="articleDialog.form.liststyle = 'style-one'">
				      		<img src="@/assets/style_one.jpg" alt="">
				      	</li>
				      	<li class="style_two" :class="{current:articleDialog.form.liststyle=='style-two'}" @click="articleDialog.form.liststyle = 'style-two'">
				      		<img src="@/assets/style_two.jpg" alt="">
				      	</li>
				      </ul>
				    </el-form-item>
  				</el-col>
  				<el-col :span="12">
  					<el-form-item label="所属栏目" label-width="6em">
				      <el-select style="width:100%" v-model="articleDialog.form.categoryId" placeholder="一级栏目">
				        <el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
				      </el-select>
				    </el-form-item>
  				</el-col>
			</el-row>
		    <el-form-item label="缩略图" label-width="6em">
		      <el-upload
		      class="upload-demo"
			  action="http://120.78.64.91:8099/manager/file/upload"
			  :on-success="handleUploadSuccess"
			  :on-remove="handleFileRemove"
			  :file-list="fileList"
			  list-type="picture">
			  <el-button size="small" type="primary">点击上传</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		    </el-form-item>
		    <el-form-item label="文章正文" label-width="6em">
		      <!-- <el-input v-model="" type="textarea" :rows="2"></el-input> -->
		      <mavon-editor ref="md" v-model="articleDialog.form.content"/>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeArticleDialog'>取 消</el-button>
		    <el-button type="primary" size='mini' @click='saveOrUpdateArticle'>确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return {
				articles:[],
				categories:[],
				loading: false,
				multipleSelection:[],
				total:10,
				params:{
					page:0,
					pageSize:5,
					categoryId:undefined,
					keywords:undefined,
					userId:undefined
				},
				articleDialog:{
					visible:false,
					form:{
						liststyle:'style-one',
						fileIds:[],
						author:''
					},
					title:'',
				},
				fileList:[]
			}
		},
		methods:{
			// 保存新增或修改
			saveOrUpdateArticle(){
				// 将作者保存到文章中
  				let user = JSON.parse(localStorage.getItem('user'));
				console.log(user.username)
				// 将html代码绑定到articleDialog.form.source上
				this.articleDialog.form.source = this.$refs.md.d_render;
				axios.post('/manager/article/saveOrUpdateArticle',this.articleDialog.form)
				.then(()=>{
					this.$message({
          			message: '保存成功',
          			type: 'success'
        			});
        			this.closeArticleDialog();
        			this.findAllArticle();
				})
				.catch(()=>{
					this.$message({
          			message: '保存失败',
          			type: 'error'
        			});
				})
			},
			// 删除
			deleteArticle(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        })
		        .then(()=>{
		        	axios.get('/manager/article/deleteArticleById?id='+id)
		        	.then(({data:result})=>{
		        		if(result.status == 200){
		        			this.$message({
		            		type: 'success',
		            		message: '删除成功!'
		            	})
		            	this.findAllArticle()
		        		}else{
		        			console.log(result);
		        		}
		        	})
		        	.catch(()=>{
		        		this.$message({
		            		type: 'error',
		            		message: '删除失败!'
		            	})
		        	})
		        })
			},
			// 修改文章
			toUpdateArticle(row){
				this.articleDialog.title = '修改文章'
				this.articleDialog.visible = true;
				// 1. 删除category，添加categoryId
				let article = _.clone(row);
				article.categoryId = article.category.id;
				delete article.category;
				// 4. 处理附件的默认显示
				this.fileList = article.articleFileVMs.map((item)=>{
					return {
						name:item.cmsFile.id,
						url:'http://39.108.81.60:8888/group1/'+item.cmsFile.id
					}
				})
				// 2.删除article.articleFileVMs，添加article.fileIds
				article.fileIds = article.articleFileVMs.map((item)=>{return item.cmsFile.id})
				delete article.articleFileVMs
				// 3. 删除值为null的article属性
				for(let key in article){
					let val = article[key]
					if(!val){
						delete article[key]
					}
				}
				this.articleDialog.form = article
			},
			// 新增
			toAddArticle(){
				this.articleDialog.title = '新增文章'
				this.articleDialog.form = {
					liststyle:'style-one',
					fileIds:[]
				};
				// 重置附件
				this.fileList = []
				this.articleDialog.visible = true;
			},
			// 批量删除
			batchDeleteArticle(){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		      	})
		      	.then(() => {
		      		let ids = this.multipleSelection.map((item)=>{
		      			return item.id
		      		})
			      	axios.post('/manager/article/batchDeleteArticle',{ids})
			      	.then(()=>{
			      		this.$message({
			         		type: 'success',
			            	message: '删除成功!'
			         	});
			         	this.findAllArticle();
			      	})
			      	.catch(()=>{
			      		this.$message({
			         		type: 'error',
			            	message: '删除失败!'
			         	});
			      	})
		      	})
			},
			// 获取所有栏目
			findAllCategory(){
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					if(result.status == 200){
						this.categories = result.data
					}
				})
				.catch((error)=>{
					console.log(error);
					this.$notify.error({
          				title: '错误',
         				message: '网络异常'
        			})
				})
			},
			// 获取所有文章
			findAllArticle(){
				this.loading = true;
				axios.get('/manager/article/findArticle',{
					params:this.params
				})
				.then(({data:result})=>{
					// console.log(result);
					this.total = result.data.total
					this.articles = result.data.list
				})
				.catch((error)=>{
					this.$notify.error({
          	title: '错误',
         		message: '网络异常'
        	})
				})
				.finally(()=>{
					this.loading = false;
				})
			},
			// 关闭模态框
			closeArticleDialog(){
				this.articleDialog.visible = false;
			},
			// 多选框获取信息
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			// 当前页的改变
			handleCurrentChange(page){
				this.params.page = page-1
			},
			// 上传图片成功
			handleUploadSuccess(response,file,fileList){
				// console.log(response,_.clone(file));
				file.name = response.data.id
				this.articleDialog.form.fileIds.push(response.data.id)
			},
			// 附件移除
			handleFileRemove(file, fileList){
				// 1.通过id移除附件
				axios.get('/manager/file/delete',{
					params:{
						id:file.name
					}
				})
				.then(()=>{
					this.$message({
			         	type: 'success',
			            message: '删除成功!'
			         });
					// 从fileIds中挪出
					_.remove(this.articleDialog.form.fileIds,(id)=>{
						return id == file.name
					})
					// 用于解决lodash的一个bug
					this.articleDialog.form.fileIds.push(1);
					this.articleDialog.form.fileIds.pop();
				})
			
			}
		},
		watch:{
			params:{
				handler:function(){
					this.findAllArticle()
				},
				deep:true
			},
			'params.categoryId':function(){
				this.params.page = 0
			},
			'params.keywords':function(){
				this.params.page = 0
			}
		},
		created(){
			this.findAllArticle();
			this.findAllCategory();
		}
	}
</script>
<style>
	.article_table {
		margin-top: .5em;
	}
	i {
		margin: 0 .3em;
		cursor: pointer;
	}
	i.fa-trash {
		color: #F56C6C;
	}
	i.fa-pencil {
		color: #409EFF;
	}
	.page {
		float: right;
		margin-top: 1em;
		margin-right: 1em;
	}
	.list_style {

	}
	.list_style li {
		width: 200px;
		height: 80px;
		border: 1px solid #ededed;
		border-radius: 3px;
		padding: .5em;
	}
	.list_style li.style_one {
		float: left;
	}
	.list_style li.style_two {
		margin-left: 220px;
	}
	.list_style li img {
		width: 100%;
	}
	.list_style li.current {
		border-color: #55a7fc;
	}
	.upload-demo {
		width: 300px;
	}
</style>