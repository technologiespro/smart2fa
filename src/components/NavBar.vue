<template>
  <b-navbar toggleable="lg" type="dark" variant="info" :sticky="true" fixed="top"
            style="position: fixed;background: linear-gradient(-45deg, #146eb9 1%, #146eb9 48%, #146eb9);">
    <b-navbar-brand><img width="24px" src="images/logo48.png"/> SMART 2FA
      <span class="badge badge-success" style="border: solid 1px rgba(35,59,93,0.76);"></span>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse-nav" is-nav>
      <b-navbar-nav class="ml-auto nav-lang">
        <b-nav-item-dropdown :text="$t('lang')" right class="text-white">
          <b-dropdown-item @click="setLang('ru')">RU</b-dropdown-item>
          <b-dropdown-item @click="setLang('en')">EN</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    async setLang(locale) {
      await this.$store.dispatch('app/setLanguage', locale);
    },
  }
}
</script>

<style scoped>

</style>
