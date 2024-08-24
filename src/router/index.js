import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/user'),
        name: 'user',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '会员管理',
          noCache: true
        }
      },
      {
        path: 'prohibit',
        component: () => import('@/views/user/prohibit'),
        name: 'prohibit',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '会员管理-被禁言',
          noCache: true
        }
      },
      {
        path: 'collect',
        component: () => import('@/views/user/collect'),
        name: 'collect',
        meta: {
          perms: ['GET /admin/collect/list'],
          title: '文章收藏',
          noCache: true
        }
      },
      {
        path: 'orderhistory',
        component: () => import('@/views/user/orderhistory'),
        name: 'orderhistory',
        meta: {
          perms: ['GET /admin/order/list'],
          title: '订单记录',
          noCache: true
        }
      },
      {
        path: 'pointhistory',
        component: () => import('@/views/user/pointhistory'),
        name: 'pointhistory',
        meta: {
          perms: ['GET /admin/order/list'],
          title: '积分记录',
          noCache: true
        }
      },
      {
        path: 'refereehistory',
        component: () => import('@/views/user/refereehistory'),
        name: 'Referee History',
        meta: {
          perms: ['GET /admin/order/list'],
          title: '推荐有礼',
          noCache: true
        }
      },
      {
        path: 'chathistory',
        component: () => import('@/views/user/chathistory'),
        name: 'chathistory',
        meta: {
          perms: ['GET /admin/chatroom/list'],
          title: '聊天记录',
          noCache: true
        }
      },
      {
        path: 'feedback',
        component: () => import('@/views/user/feedback'),
        name: 'feedback',
        meta: {
          perms: ['GET /admin/feedback/list'],
          title: '意见反馈',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/anchor',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'anchorManage',
    meta: {
      title: '主持人管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'anchor',
        component: () => import('@/views/anchor/anchor'),
        name: 'anchor',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '主持人管理',
          noCache: true
        }
      },
      {
        path: 'applicants',
        component: () => import('@/views/anchor/applicants'),
        name: 'applicants',
        meta: {
          perms: ['GET /admin/user/list'],
          title: '主持人申请',
          noCache: true
        }
      },
      {
        path: 'chathistory',
        component: () => import('@/views/anchor/chathistory'),
        name: 'chathistory',
        meta: {
          perms: ['GET /admin/chatroom/list'],
          title: '主持人工作记录',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'articleManage',
    meta: {
      title: '文章管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'raw',
        component: () => import('@/views/article/raw'),
        name: 'raw',
        meta: {
          perms: ['GET /admin/article/list', 'POST /admin/article/manage'],
          title: '投稿区',
          noCache: true
        }
      },
      {
        path: 'articles',
        component: () => import('@/views/article/articles'),
        name: 'articles',
        meta: {
          perms: ['GET /admin/article/list', 'POST /admin/article/manage'],
          title: '文章列表',
          noCache: true
        }
      },
      {
        path: 'tipoftheday',
        component: () => import('@/views/article/tipoftheday'),
        name: 'tipoftheday',
        meta: {
          perms: ['GET /admin/article/list', 'POST /admin/article/manage'],
          title: '解压小提示列表',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/chatroom',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'clinic',
    meta: {
      title: '聊天室管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'chatroomstatistic',
        component: () => import('@/views/chatroom/chatroomstatistic'),
        name: 'ChatroomStatistic',
        meta: {
          perms: ['GET /admin/chatroom/list', 'POST /admin/chatroom/manage'],
          title: '聊天室统计数据',
          noCache: true
        }
      },
      {
        path: 'schedule',
        component: () => import('@/views/chatroom/schedule'),
        name: 'schedule',
        meta: {
          perms: ['GET /admin/chatroom/list', 'POST /admin/chatroom/manage'],
          title: '排课日程创建',
          noCache: true
        }
      },
      {
        path: 'schedulestatus',
        component: () => import('@/views/chatroom/schedulestatus'),
        name: 'schedulestatus',
        meta: {
          perms: ['GET /admin/chatroom/list', 'POST /admin/chatroom/manage'],
          title: '主持人课表安排情况',
          noCache: true
        }
      },
      {
        path: 'timeslotplan',
        component: () => import('@/views/chatroom/timeslotplan'),
        name: 'timeslotplan',
        meta: {
          perms: ['GET /admin/chatroom/list', 'POST /admin/chatroom/manage'],
          title: '排课日程系统参数设置',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/quiz',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'quiz',
    meta: {
      title: '测试题管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'quizlist',
        component: () => import('@/views/quiz/quizlist'),
        name: 'clinicList',
        meta: {
          perms: ['GET /admin/quiz/list', 'POST /admin/quiz/manage'],
          title: '测试题列表',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/clinic',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'clinic',
    meta: {
      title: '咨询机构列表管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'clinics',
        component: () => import('@/views/clinic/clinics'),
        name: 'clinicList',
        meta: {
          perms: ['GET /admin/clinic/list', 'POST /admin/clinic/manage'],
          title: '咨询机构列表',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: '管理员',
          noCache: true
        }
      },
      {
        path: 'notice',
        component: () => import('@/views/sys/notice'),
        name: 'sysNotice',
        meta: {
          perms: ['GET /admin/notice/list', 'POST /admin/notice/create', 'POST /admin/notice/update', 'POST /admin/notice/delete'],
          title: '通知管理',
          noCache: true
        }
      },
      {
        path: 'log',
        component: () => import('@/views/sys/log'),
        name: 'log',
        meta: {
          perms: ['GET /admin/log/list'],
          title: '操作日志',
          noCache: true
        }
      },
      {
        path: 'role',
        component: () => import('@/views/sys/role'),
        name: 'role',
        meta: {
          perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions'],
          title: '角色管理',
          noCache: true
        }
      },
      {
        path: 'os',
        component: () => import('@/views/sys/os'),
        name: 'os',
        meta: {
          perms: ['GET /admin/storage/list', 'POST /admin/storage/create', 'POST /admin/storage/update', 'POST /admin/storage/delete'],
          title: '对象存储',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/config',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'configManage',
    meta: {
      title: '配置管理',
      icon: 'chart'
    },
    children: [
      {
        path: 'promotion',
        component: () => import('@/views/config/promotion'),
        name: 'configOrder',
        meta: {
          perms: ['GET /admin/config/list', 'POST /admin/config/manage'],
          title: '促销活动设置',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/config/order'),
        name: 'configOrder',
        meta: {
          perms: ['GET /admin/config/list', 'POST /admin/config/manage'],
          title: '系统常数配置',
          noCache: true
        }
      },
      {
        path: 'wx',
        component: () => import('@/views/config/wx'),
        name: 'configWx',
        meta: {
          perms: ['GET /admin/config/list', 'POST /admin/config/manage'],
          title: '小程序配置',
          noCache: true
        }
      },
      {
        path: 'tag',
        component: () => import('@/views/config/tag'),
        name: 'tag',
        meta: {
          perms: ['GET /admin/tag/list', 'POST /admin/tag/manage'],
          title: '类目设置',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/stat',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'statManage',
    meta: {
      title: '统计报表',
      icon: 'chart'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/stat/user'),
        name: 'statUser',
        meta: {
          perms: ['GET /admin/stat/list'],
          title: '用户统计',
          noCache: true
        }
      },
      {
        path: 'stat',
        component: () => import('@/views/stat/stat'),
        name: 'stat',
        meta: {
          perms: ['GET /admin/stat/list'],
          title: '统计.比较',
          noCache: true
        }
      },
      {
        path: 'order',
        component: () => import('@/views/stat/order'),
        name: 'statOrder',
        meta: {
          perms: ['GET /admin/stat/list'],
          title: '订单统计',
          noCache: true
        }
      },
      {
        path: 'tag',
        component: () => import('@/views/stat/tag'),
        name: 'tag',
        meta: {
          perms: ['GET /admin/stat/list'],
          title: '用户使用标签统计',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      },
      {
        path: 'notice',
        component: () => import('@/views/profile/notice'),
        name: 'notice',
        meta: { title: '通知中心', noCache: true }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
