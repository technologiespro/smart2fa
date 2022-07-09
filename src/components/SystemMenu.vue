<template>
  <div id="system-menu" class="noselect">

  </div>
</template>

<script>
export default {
  name: "SystemMenu",
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
  },
}
</script>

<style scoped>

</style>