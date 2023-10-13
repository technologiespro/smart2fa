<template>
  <div id="app">
    <router-view/>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>

export default {
  methods: {},
  async beforeCreate() {
    if (navigator.language === 'ru') {
      this.$i18n.locale = 'ru'
    } else {
      this.$i18n.locale = 'en'
    }
    this.$store._vm.$on('vuex-persist:ready', async () => {
      const pin = await this.$store.getters['app/pin'];
      const storeLang = this.$store.getters['app/language'];
      if (storeLang) {
        this.$i18n.locale = storeLang;
      }
      if (!pin) {
        await this.$router.push('/set-pin')
      }
    })
  },
  async created() {

  }
}
</script>
<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100% !important;
  height: 100vh;
}

@import "../node_modules/vue-snotify/styles/material.css";
</style>
