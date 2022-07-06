<template>
  <div id="app">
    <div>

    </div>
<!--
    <div id="nav">
      <span class="badge badge-info">{{allKeys.length}}</span> <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
-->
    <router-view/>


  </div>
</template>

<script>
//import {generateToken} from "node-2fa";

export default {
  methods: {

    minimize: function () {
        if (process.env.IS_ELECTRON) {
          const electron = require('electron');
          const window = electron.remote.getCurrentWindow();
          window.minimize()
        }

    },
    close: function () {
      if (process.env.IS_ELECTRON) {
        const electron = require('electron');
        const window = electron.remote.getCurrentWindow();
        window.close()
      }
    },
    reload: function () {
    //  reload();
    }
  },
  async created() {
    const browserLang =  navigator.language;

    if (browserLang === 'ru-RU') {
      this.$i18n.locale = 'ru'
    } else {
      this.$i18n.locale = 'en'
    }
    this.$store._vm.$on('vuex-persist:ready', async () => {
     //console.log(await this.$store.getters['keys2fa/faKeys'])

    })
  }
}
</script>
<style>
-moz-scrollbar, ::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}


::-webkit-scrollbar {
  background-color: #fefdf9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(-45deg, #fbbe8d 1%, #4eabf7 48%, #fbbe8d);
  border: 1px solid #434a52;
}

body, html {
  padding: 0;
  margin: 0;
  width:100%;
  overflow-x: hidden;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100% !important;
  height: 100vh;
}
</style>
