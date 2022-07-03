<template>
  <div class="home">
    <div class="row">
      <div class="container-fluid">
        <span class="badge badge-info float-left">{{allKeys.length}}</span> {{process}}
        <b-button-group>
          <b-button @click="op = 'addKey'">Добавить</b-button>
          <b-button @click="op = 'importKeys'">Импортировать</b-button>
        </b-button-group>
      </div>


      <div class="ml-auto mr-auto">
        <div v-if="op === 'importKeys'">
          <p>Импорт ключейн из Google Auth</p>
          <p>
            <QrScanImport2fa/>
          </p>
        </div>
      </div>


    </div>

    <div class="mt-1 text-left ml-2" style="height:700px; overflow-y:auto">
      <div v-for="item in allKeys" v-bind:key="item.secret">
        <span v-show="!item.name.includes(item.issuer)">{{item.issuer}}</span> {{ item.name }}<br/>
        <span class="font-weight-bolder">{{ item.token }}</span>
        <hr/>
      </div>
    </div>
  </div>
</template>

<script>
import QrScanImport2fa from '@/components/QrScanImport2fa.vue'
const twofactor = require("node-2fa");

export default {
  name: 'Home',
  components: {QrScanImport2fa},
  data() {
    return {
      op: null,
      importResult: [],
      allKeys: [],
      timer: null,
      process: false,
    }
  },
  /*
  computed: {
    allKeys() {

      let keys = this.$store.getters['keys2fa/faKeys'];
      let result = [];
      for (let i=0; i < keys.length; i++) {
        result[i] = {
          issuer: keys[i].issuer,
          name: keys[i].name,
          token: twofactor.generateToken(keys[i].secret).token
        }
      }

      return (result)
    }

  },
   */
methods: {
    async listTokens() {
      this.$store._vm.$on('vuex-persist:ready', async () => {
        let keys = this.$store.getters['keys2fa/faKeys'];
        let result = [];
        for (let i=0; i < keys.length; i++) {
          result[i] = {
            issuer: keys[i].issuer,
            name: keys[i].name,
            token: twofactor.generateToken(keys[i].secret).token
          }
        }
        this.allKeys = result;

      })

    },

    async generateTokens() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.listTokens();
        await this.generateTokens();
      }, 50000);
    }
  },
  async created() {


    await this.$eventBus.on('qr:importKeys', async (data) => {
      for (let i = 0; i < data.length; i++) {
        let isDublicate = false;
        for (let j = 0; j < this.importResult.length; j++) {
            if (this.importResult[j].secret === data[i].secret) {
              isDublicate = true;
            }
        }
        if (!isDublicate) {
          this.importResult.push(data[i]);
        }
      }
      await this.$store.dispatch('keys2fa/setKeys', this.importResult);
      await this.listTokens();
    });
    await this.listTokens();
  }
}
</script>

<style>
.home {
  max-width: 480px;
  height: 768px;
  border: solid 1px #ccc;
  margin-left: auto;
  margin-right: auto;
}
</style>
