<template>
  <div class="w-100">
    <div v-if="op === 'importKeys'" style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 4% !important; margin: 0 !important; ">
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px;">
        <b-button @click="op = 'home'" :pill="true" variant="info">X</b-button>
      </div>


      <QrScanImport2fa style="margin-left: auto; margin-right: auto; width:250px; height:250px; border: solid 2px #333;"/>
    </div>
    <div class="row">

      <div class="container mb-2" style="margin-top:55px;">
        <div class="w-100" style="background: rgb(193 51 162);position: fixed; margin-top: 0px">
          <!--<b-progress :value="((countdown * (seconds / totalSeconds * 100) / 100))" :max="countdown" animated></b-progress>-->
          <span style="float: right;height: 5px;background: #1fab1a;"
                :style="'width:' + ((screenWidth * (seconds / totalSeconds * 100) / 100)) + 'px;'"></span>
        </div>
      <div v-for="(item, idx) in allKeys" v-bind:key="item.secret" class="w-100 pl-2 item-2fa">
        {{idx+1}} <span v-show="!item.name.includes(item.issuer)">{{ item.issuer }}</span> {{ item.name }}<br/>
        <span class="font-weight-bold token">
          {{item.token}}
        </span>
      </div>
      </div>

    </div>


    <div class="container">
      <div class="ml-auto mr-auto">
        <b-button class="mr-1" @click="op = 'addKey'">Добавить</b-button>
        <b-button @click="op = 'importKeys'">Импортировать</b-button>
      </div>

    </div>


  </div>
</template>

<script>
import QrScanImport2fa from '@/components/QrScanImport2fa.vue'
import {generateToken} from "node-2fa";
//import AnimatedNumber from "animated-number-vue";

export default {
  name: 'Home',
  components: {
    QrScanImport2fa,
    //AnimatedNumber
  },
  data() {
    return {
      op: 'home',
      importResult: [],
      allKeys: [],
      timer: null,
      process: false,
      seconds: 0,
      totalSeconds: 32,
      timerTimeout: null,
      screenWidth: 480,
    }
  },
  computed: {
    storedKeys() {
      return this.$store.getters['keys2fa/faKeys'];
      /*
      let keys = this.$store.getters['keys2fa/faKeys'];
      let result = [];
      for (let i=0; i < keys.length; i++) {
        result[i] = {
          secret: keys[i].secret,
          issuer: keys[i].issuer,
          name: keys[i].name,
          token: generateToken(keys[i].secret).token
        }
      }
      return (result)
       */
    }
  },
  methods: {
    makeToast(variant = null, title= 'Success', message = '') {
      this.$bvToast.toast(message, {
        title: title,
        toaster: 'b-toaster-bottom-right',
        variant: variant,
        solid: true
      })
    },
    async regenerateTokens() {
      this.allKeys = [];
      for (let i = 0; i < this.storedKeys.length; i++) {
        this.allKeys[i] = {
          secret: this.storedKeys[i].secret,
          issuer: this.storedKeys[i].issuer,
          name: this.storedKeys[i].name,
          token: generateToken(this.storedKeys[i].secret).token
        }
      }
      //this.allKeys = result;
      //await this.generateTokens();
    },

    async generateTokens() {
      console.log('generateTokens');
      clearInterval(this.timer);
      clearTimeout(this.timerTimeout);
      await this.regenerateTokens();

      this.seconds = this.totalSeconds;

      this.timer = setInterval(async () => {
        this.seconds = this.seconds - 1;
        if (this.seconds === 0) {
          this.seconds = this.totalSeconds;
          await this.generateTokens();
        }
      }, 1000);

      /*
      this.timerTimeout = setTimeout(async () => {
        this.seconds = this.totalSeconds;
        await this.generateTokens();
        clearInterval(this.timer);
      }, this.totalSeconds * 1000);
       */

    },

  },
  async created() {
    this.screenWidth = window.innerWidth;
    this.$store._vm.$on('vuex-persist:ready', async () => {
      await this.generateTokens();
    });
    await this.$eventBus.on('qr:importKeys', async (data) => {
      this.op = 'home';
      await this.$store.dispatch('keys2fa/setKeys', data);
      await this.generateTokens();
      await this.makeToast('success', 'Ключи успешно добавлены ' + data.length);
    });
  }
}
</script>

<style>
.item-2fa {
  border-bottom: dashed 1px #76797c;
  padding-bottom: 4px;
  padding-top: 2px;
}

.item-2fa:hover {
  background: #bdc0c2;
  cursor: pointer;
  border-bottom: 1px;
  border-bottom: solid 1px #1371ce;
}

.token {
  font-size: 20px;
  color: #233b5d;
  text-shadow: 1px 1px 0.06em rgba(226, 246, 97, 0.6);
  /*
  animation: color-change 32s infinite;
   */
}

svg {
  display: block;
  margin: 15px auto;
}

#loader {
  fill: #0088cc
}

#border {
  fill: #00517a
}
</style>
