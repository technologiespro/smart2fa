import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import eventBus from '@/plugins/event-bus'

Vue.config.productionTip = false
Vue.prototype.$eventBus = eventBus

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
