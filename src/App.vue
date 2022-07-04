<template>
  <div id="app">
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
