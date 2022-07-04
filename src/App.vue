<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info" fixed>
        <b-navbar-brand href="#">Smart2FA</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
            </b-nav-form>

            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">RU</b-dropdown-item>
              <b-dropdown-item href="#">CN</b-dropdown-item>
              <b-dropdown-item href="#">EN</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>User</em>
              </template>
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
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
    <p class="text-center">
      <a target="_blank" href="https://smartholdem.io" class="small">(C) SmartHoldem</a>
    </p>
  </div>
</template>

<script>
import {generateToken} from "node-2fa";
export default {
  computed: {
    allKeys() {

      let keys = this.$store.getters['keys2fa/faKeys'];
      let result = [];
      for (let i=0; i < keys.length; i++) {
        result[i] = {
          issuer: keys[i].issuer,
          name: keys[i].name,
          token: generateToken(keys[i].secret).token
        }
      }

      return (result)
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
