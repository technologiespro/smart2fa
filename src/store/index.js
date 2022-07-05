import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist'
import * as localforage from 'localforage';
import {pullAll, keys} from 'lodash';

import vuexPersistReady from '@/store/plugins/vuex-persist-ready';

import keys2fa from '@/store/modules/keys2fa';
import app from '@/store/modules/app';


//import * as memoryDriver from 'localforage-driver-memory'

Vue.use(Vuex)

const modules = {
  app: app,
  keys2fa: keys2fa,
};

// Modules that should not be persisted
const ignoreModules = [];

// localforage.defineDriver(memoryDriver)
// localforage.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL, memoryDriver._driver])

const vuexPersist = new VuexPersistence({
  // It is necessary to enable the strict mode to watch to mutations, such as `RESTORE_MUTATION`
  strictMode: true,
  asyncStorage: true,
  key: 'sth2fa',
  storage: localforage,
  modules: pullAll(keys(modules), ignoreModules)
});

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  actions: {
    resetData() {
      return localforage.clear()
    }
  },
  plugins: [
    vuexPersist.plugin,
    vuexPersistReady,
  ]
})
