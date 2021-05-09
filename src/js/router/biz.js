const KnowledgeCategory = () => import(/* webpackChunkName: "KnowledgeCategory" */ 'pages/knowledge-category/index.vue')
const KnowledgeContent = () => import(/* webpackChunkName: "KnowledgeContent" */ 'pages/knowledge-content/index.vue')
const KnowledgeContentEdit = () => import(/* webpackChunkName: "KnowledgeContentEdit" */ 'pages/knowledge-content/edit.vue')
const DisplayRule = () => import(/* webpackChunkName: "DisplayRule" */ 'pages/display-rule/index.vue')
const DisplayContent = () => import(/* webpackChunkName: "DisplayContent" */ 'pages/display-content/index.vue')
const SearchTag = () => import(/* webpackChunkName: "SearchTag" */ 'pages/search-tag/index.vue')
const SearchRule = () => import(/* webpackChunkName: "SearchRule" */ 'pages/search-rule/index.vue')
const AdUpload = () => import(/* webpackChunkName: "AdUpload" */ 'pages/ad/upload.vue')

export default [
  {
    path: '/knowledge/category',
    component: KnowledgeCategory,
    meta: {
      title: '知识体系管理',
      menuPath: '/knowledge/category',
      keepAlive: true,
      auth: false
    }
  },
  {
    path: '/knowledge/content',
    component: KnowledgeContent,
    meta: {
      title: '知识内容管理',
      menuPath: '/knowledge/content',
      keepAlive: true,
      auth: false
    }
  },

  {
    path: '/knowledge/content/edit',
    component: KnowledgeContentEdit,
    meta: {
      title: '知识内容编辑',
      menuPath: '/knowledge/content',
      keepAlive: true,
      auth: false
    }
  },

  {
    path: '/display/rule',
    component: DisplayRule,
    meta: {
      title: '内容展示规则',
      menuPath: '/display/rule',
      keepAlive: true,
      auth: false
    }
  },

  {
    path: '/search/tag',
    component: SearchTag,
    meta: {
      title: '标签管理',
      menuPath: '/search/tag',
      keepAlive: true,
      auth: false
    }
  },

  {
    path: '/search/rule',
    component: SearchRule,
    meta: {
      title: '规则ß管理',
      menuPath: '/search/rule',
      keepAlive: true,
      auth: false
    }
  },

  {
    path: '/display/content',
    component: DisplayContent,
    meta: {
      title: '宣教展示内容',
      menuPath: '/display/content',
      keepAlive: true,
      auth: false
    }
  },

  {
    path: '/ad/upload',
    component: AdUpload,
    meta: {
      title: '上传广告图片',
      menuPath: '/ad/upload',
      keepAlive: true,
      auth: false
    }
  }
];
