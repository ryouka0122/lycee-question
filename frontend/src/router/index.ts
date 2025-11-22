import {createRouter, createWebHistory} from 'vue-router'

import SpaceList from '@/components/SpaceList.vue'
import QrCodeJoinView from '@/components/QrCodeJoinView.vue'
import MainView from '@/components/layouts/MainView.vue'

const routes = [
  {
    path: '/',
    name: 'spaceList',
    component: SpaceList
  },
  {
    path: '/join',
    name: 'qrCodeJoin',
    component: QrCodeJoinView
  }

]

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainView,
      children: routes
    }
  ]
})


