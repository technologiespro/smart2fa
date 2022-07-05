<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info" :sticky="true" fixed="top" style="position: fixed;background: linear-gradient(-45deg, #9510b2 1%, #4eabf7 48%, #fbbe8d);">
        <b-navbar-brand><img width="22px" src="/images/logo48.png"/> Smart2FA</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <!--
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>
            -->
<!--
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">RU</b-dropdown-item>
              <b-dropdown-item href="#">CN</b-dropdown-item>
              <b-dropdown-item href="#">EN</b-dropdown-item>
            </b-nav-item-dropdown>
    -->
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
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
