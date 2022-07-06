import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import mixins from './mixins';
import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import eventBus from '@/plugins/event-bus'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.mixin(mixins);
Vue.prototype.$eventBus = eventBus;
Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightTop,
  }
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
