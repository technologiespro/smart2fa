<template>
  <div id="system-menu" class="noselect">
    <span @click="minimize">_</span>
  </div>
</template>

<script>

import electron from 'electron';

export default {
  name: "SystemMenu",
  data() {
    return {
      isElectron: process.env.IS_ELECTRON,
    }
  },
  methods: {
    minimize: function () {
      //if (this.isElectron) {
        electron.remote.getCurrentWindow().minimize();
      //}

    },
    close: function () {
      if (this.isElectron) {
        const window = electron.remote.getCurrentWindow();
        window.close()
      }
    },
  },
}
</script>

<style>
#system-menu {
  color: #fff;
  text-align: right;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 0.88rem;
  z-index: 9000;
  position: absolute;
  top: 0;
  width: 100%;
  height: 28px;
  margin-top: 0px;
  padding-top: 4px;
  margin-bottom: 40px;
  padding-bottom: 4px;
  background: #1371ce;
  background: linear-gradient(to bottom, #1b8bc4 0%,#000 100%);
  border-bottom: solid 1px #1b1919;
}
</style>