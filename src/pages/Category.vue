<template>
	<div class="category">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click="toAddCategory">新增</el-button>
			<el-button size='mini' @click="batchDeleteCategory">批量删除</el-button>
		</div>
		<!-- 栏目管理表格 -->
		<div class="category_table" v-loading="loading">
			<el-table :data="categories" border style="width: 100%" size='mini' @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="38">
    			</el-table-column>
    			<el-table-column prop="name" label="栏目名称" width="180">
    			</el-table-column>
			    <el-table-column prop="parent.name" label="父栏目" width="180">
			    </el-table-column>
			    <el-table-column prop="comment" label="描述">
			    </el-table-column>
			    <el-table-column label="操作" width='60'>
			    	<template slot-scope='{row}'>
			    		<i class="fa fa-pencil" @click="toUpdateCategory(row)"></i>
			    		<i class="fa fa-trash" @click="deleteCategory(row.id)"></i>
			    	</template>
			    </el-table-column>
			</el-table>
		</div>
		<!-- 模态框 -->
		<el-dialog :title="cDialog.title" :visible.sync="cDialog.visible">
		  <el-form :model="cDialog.form" size="mini" label-position="left" >
		    <el-form-item label="栏目名称" label-width="6em">
		      <el-input v-model="cDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="父栏目" label-width="6em">
		      <el-select v-model="cDialog.form.parentId" placeholder="一级栏目">
		        <el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="栏目描述" label-width="6em">
		      <el-input v-model="cDialog.form.comment" type="textarea" :rows="2"></el-input>
		    </el-form-item>
		  </el-form>
		  <!-- {{cDialog.form}} -->
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeCDialog'>取 消</el-button>
		    <el-button type="primary" size='mini' @click='saveOrUpdateCategory'>确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return {
				categories:[],
				loading: false,
				multipleSelection:[],
				cDialog:{
					visible:false,
					form:{},
					title:''
				}
			}
		},
		methods:{
			// 获取所有栏目
			findAllCategory(){
				this.loading = true;
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					this.categories = result.data
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
			// 删除
			deleteCategory(id){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        	confirmButtonText: '确定',
        	cancelButtonText: '取消',
        	type: 'warning'
      	})
      	.then(()=>{
      		axios.get('/manager/category/deleteCategoryById?id='+id)
						.then(({data:result})=>{
							if(result.status == 200){
								this.$notify.success({
			         		title: '成功',
			         		message: '删除成功！'
			        		});
			        		this.findAllCategory();
						}else{
							this.$notify.error({
			         		title: '失败',
			         		message: '删除失败！'
			        		});
						}
					})
					.catch(()=>{
						this.$notify.error({
			         	title: '失败',
			         	message: '网络异常！'
			        	});
					})
      	})
			},
			// 新增
			toAddCategory(){
				this.cDialog.title = '新增栏目'
				this.cDialog.visible = true;
				this.cDialog.form = {};
			},
			// 修改
			toUpdateCategory(row){
				// 修改标题
				this.cDialog.title = '修改栏目'
				// 克隆并删除category，添加categoryId
				let category = _.clone(row);
				category.parentId = category.parent.id;
				delete category.parent;
				// 删除值为null的category属性
				for(let key in category){
					let val = category[key]
					if(!val){
						delete category[key]
					}
				}
				this.cDialog.form = category;
				this.cDialog.visible = true;
			},
			// 批量删除
			batchDeleteCategory(){
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		      	})
		      	.then(() => {
		      		let ids = this.multipleSelection.map((item)=>{
		      			return item.id
		      		})
			      	axios.post('/manager/category/batchDeleteCategory',{ids})
			      	.then(()=>{
			      		this.$message({
			         		type: 'success',
			            	message: '删除成功!'
			         	});
			         	this.findAllCategory();
			      	})
			      	.catch(()=>{
			      		this.$message({
			         		type: 'error',
			            	message: '删除失败!'
			         	});
			      	})
		      	})
			},
			// 保存更新或新增
			saveOrUpdateCategory(){
				axios.post('/manager/category/saveOrUpdateCategory',this.cDialog.form)
				.then(()=>{
					this.$message({
          			message: '保存成功',
          			type: 'success'
        			});
        			this.closeCDialog();
        			this.findAllCategory();
				})
				.catch(()=>{
					this.$message({
          			message: '保存失败',
          			type: 'error'
        			});
				})
			},
			// 关闭模态框
			closeCDialog(){
				this.cDialog.visible = false;
			},
			// 获取栏目信息复选框
			handleSelectionChange(val){
				this.multipleSelection = val;
			}
		},
		mounted(){
			// 加载数据
			this.findAllCategory()
		}
	}
</script>
<style>
	.category_table {
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
</style>