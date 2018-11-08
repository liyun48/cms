import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/pages/Hello'
import Category from '@/pages/Category'
import Article from '@/pages/Article'
import User from '@/pages/User'
import Exam from '@/pages/Exam'
import ExamCreate from '@/pages/exam/ExamCreate'
import ExamPlace from '@/pages/exam/ExamPlace'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },{
      path: '/category',
      name: 'Category',
      component: Category
    },{
      path: '/article',
      name: 'Article',
      component: Article
    },{
      path: '/user',
      name: 'User',
      component: User
    },{
      path: '/exam',
      name: 'Exam',
      component: Exam,
      children:[{
        path:'create',      /* 路由 /exam/create */
        component:ExamCreate
      },{
        path:'place',       /* 路由 /exam/place */
        component:ExamPlace
      }]
    }
  ]
})
