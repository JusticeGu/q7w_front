import Vue from 'vue'
import Router from 'vue-router'
import AppIndex from '../components/home/AppIndex'
import Articles from '../components/jotter/Articles'
import Editor from '../components/admin/content/ArticleEditor'
import LibraryIndex from '../components/library/LibraryIndex'
import Login from '../components/Login'
import Home from '../components/Home'
import AdminIndex from '../components/admin/AdminIndex'
import Register from '../components/Register'
import DashBoard from '../components/admin/dashboard/admin/index'
import ArticleDetails from '../components/jotter/ArticleDetails'
import Error404 from '../components/pages/Error404'
import clubuser from '../components/admin/club/NewClubUserProfile'
import join_in from '../components/admin/club/join_in'
import first from '../components/admin/club/first'
import yimian from '../components/admin/club/yimain'
import second from '../components/admin/club/second'
import status from '../components/admin/club/status'
import sanmian from '../components/admin/club/sanmian'
import Msgreg from '../components/msgreg'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/home',
      component: Home
    },
    {
      path: '/club',
      name: 'clubuser',
      component: clubuser
    },
    {
      path: '/first',
      name: 'club1',
      component: first
    },
    {
      path: '/yimian',
      name: 'club1m',
      component: yimian
    },
    {
      path: '/second',
      name: 'club2',
      component: second,
      meta:{title: 'Q7W后台统一认证端'}
    },
    {
      path: '/sanmian',
      name: 'club3mi',
      component: sanmian
    },
    {
      path: '/join_in',
      name: 'clubuser_in',
      component: join_in
    },
    {
      path: '/status',
      name: 'club_status',
      component: status
    },
    {
      // home页面并不需要被访问，只是作为其它组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex
        },
        {
          path: '/jotter',
          name: 'Jotter',
          component: Articles
        },
        {
          path: '/jotter/article',
          name: 'Article',
          component: ArticleDetails
        },
        {
          path: '/admin/content/editor',
          name: 'Editor',
          component: Editor,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/library',
          name: 'Library',
          component: LibraryIndex,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/msgreg',
      name: 'Msgreg',
      component: Msgreg
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminIndex,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/admin/dashboard',
          name: 'Dashboard',
          component: DashBoard,
          meta: {
            requireAuth: false
          }
        }

      ]
    },
    {
      path: '*',
      component: Error404
    }
  ]
})

// 用于创建默认路由
export const createRouter = routes => new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/home',
      component: Home
    },
    {
      // home页面并不需要被访问，只是作为其它组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'AppIndex',
          component: AppIndex
        },
        {
          path: '/jotter',
          name: 'Jotter',
          component: Articles
        },
        {
          path: '/jotter/article',
          name: 'Article',
          component: ArticleDetails
        },
        {
          path: '/admin/content/editor',
          name: 'Editor',
          component: Editor,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/library',
          name: 'Library',
          component: LibraryIndex,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminIndex,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '/admin/dashboard',
          name: 'Dashboard',
          component: DashBoard,
          meta: {
            requireAuth: true
          }
        }

      ]
    },
    {
      path: '*',
      component: Error404
    }
  ]
})
