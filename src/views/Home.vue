<template>
  <div class="home">
    <div class="row">


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
        <span class="font-weight-bolder text-info">{{ item.token }}</span>
        <span style="float: right;width:40px;height: 20px;background: #1a5eab;" :style="'width:' + seconds + 'px;'"></span>
        <hr/>
      </div>
    </div>
    <p class="small">Создано в SmartHoldem</p>
    <div class="container-fluid">
      <span class="badge badge-info float-left">{{allKeys.length}}</span>
      <b-button-group>
        <b-button @click="op = 'addKey'">Добавить</b-button>
        <b-button @click="op = 'importKeys'">Импортировать</b-button>
      </b-button-group>
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
      seconds: 0,
      totalSeconds: 40,
      timerTimeout: null,
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
  async regenerateTokens() {
    let keys = this.allKeys;
    let result = [];
    for (let i=0; i < keys.length; i++) {
      result[i] = {
        secret: keys[i].secret,
        issuer: keys[i].issuer,
        name: keys[i].name,
        token: twofactor.generateToken(keys[i].secret).token
      }
    }
    this.allKeys = result;
    await this.generateTokens();
  },

    async listTokens() {
      this.$store._vm.$on('vuex-persist:ready', async () => {
        let keys = this.$store.getters['keys2fa/faKeys'];
        //console.log(keys)
        let result = [];
        for (let i=0; i < keys.length; i++) {
          result[i] = {
            secret: keys[i].secret,
            issuer: keys[i].issuer,
            name: keys[i].name,
            token: twofactor.generateToken(keys[i].secret).token
          }
        }
        this.allKeys = result;
        await this.generateTokens();
      })
    },

    async generateTokens() {
      //clearInterval(this.timer);
      clearTimeout(this.timerTimeout);
      this.seconds = this.totalSeconds;

      this.timer = setInterval(async () => {
        this.seconds = this.seconds - 1;
      }, 1000);


      this.timerTimeout = setTimeout(async() => {
        this.seconds = this.totalSeconds;
        await this.regenerateTokens();
        clearInterval(this.timer);
        }, this.seconds * 1000);
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

svg {
  display: block;
  margin: 15px auto;
}

#loader
{ fill: #0088cc }

#border
{ fill: #00517a }
</style>
