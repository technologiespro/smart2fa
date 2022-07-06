<template>
  <div class="w-100">
    <b-navbar toggleable="lg" type="dark" variant="info" :sticky="true" fixed="top"
              style="position: fixed;background: linear-gradient(-45deg, #9510b2 1%, #4eabf7 48%, #fbbe8d);">
      <b-navbar-brand><img width="22px" src="/images/logo48.png"/> Smart2FA</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item @click="op = 'importKeys'; ddShow = false">
            <span class="text-white" style="text-shadow: 1px 1px 0.1em #333;">{{ $t('import_from_google') }}</span>
          </b-nav-item>
          <b-nav-item @click="jsonDownload">
            <span class="text-white" style="text-shadow: 1px 1px 0.1em #333;">{{ $t('save_to_file') }}</span>
          </b-nav-item>

        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!--
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          -->

          <b-nav-item-dropdown :text="$t('lang')" right style="text-shadow: 1px 1px 0.1em #333;">
            <b-dropdown-item @click="setLang('ru')">RU</b-dropdown-item>
            <b-dropdown-item @click="setLang('en')">EN</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <vue-snotify></vue-snotify>
    <!--{{storedKeys}}-->
    <div v-if="op === 'importKeys'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 4% !important; margin: 0 !important; ">
      <QrScanImport2fa
          style="margin-left: auto; margin-right: auto; width:250px; height:250px; border: solid 2px #333;margin-top: 50px;"/>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 10px;">
        <b-button @click="op = 'home'" :pill="true" variant="info">X</b-button>
      </div>
    </div>

    <div v-if="op === 'addKeyIn'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 1% !important; margin: 0 !important; ">
      <AddNewKeyIn style="margin-left: auto; margin-right: auto; width:100%; margin-top: 80px;"/>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 10px;">
        <b-button @click="op = 'home'" :pill="true" variant="info">X</b-button>
      </div>
    </div>

    <div v-if="op === 'addKeyQR'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 4% !important; margin: 0 !important; ">
      <AddNewKeyQr
          style="margin-left: auto; margin-right: auto; width:250px; height:250px; border: solid 2px #333;margin-top: 50px;"/>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 10px;">
        <b-button @click="op = 'home'" :pill="true" variant="info">X</b-button>
      </div>
    </div>

    <div class="row">
      <div class="container mb-2" style="margin-top:55px;padding-bottom: 38px;">
        <div class="w-100" style="background: rgb(193 51 162);position: fixed; margin-top: 0px">
          <!--<b-progress :value="((countdown * (seconds / totalSeconds * 100) / 100))" :max="countdown" animated></b-progress>-->
          <span style="float: right;height: 5px;background: #1fab1a;"
                :style="'width:' + ((screenWidth * (seconds / totalSeconds * 100) / 100)) + 'px;'"></span>
        </div>

        <!-- ITEMS -->
        <div v-for="(item, idx) in allKeys" v-bind:key="item.secret" class="w-100 pl-2 item-2fa"
             style="position: relative"
             @click="itemSelect(idx)" v-bind:class="{ itemActive: idx === selectedItem }">
          <div v-show = "submenu === idx" class="itemSubMenu">
            <span @click="itemDel(idx)" class="badge badge-danger mr-3">DEL</span>
            <span @click="itemRawData(idx)" class="badge badge-info mr-3">RAW</span>
            <span @click="submenu = null" class="badge badge-warning">CANCEL</span>
          </div>
          <span v-show="!item.name.includes(item.issuer)">{{ item.issuer }}</span> {{ item.name }}<br/>
          <div @click="submenu !== idx ? submenu = idx : submenu = null" class="float-right pr-2">
            <b-icon icon="three-dots-vertical" font-scale="1"></b-icon>
          </div>
          <span class="font-weight-bold token">
            {{ item.token }}
          </span>
        </div>
        <!-- ITEMS END -->

        <img @click="ddShow = !ddShow" class="btnBotAdd" src="images/add.png"/>
        <div v-show="ddShow"
             style="border-radius: 6px 6px 0 6px; position: absolute; bottom: 56px;right: 15px; background: linear-gradient(-45deg, #9510b2 1%, #4eabf7 48%, #fbbe8d);">
          <b-nav vertical class="w-100">
            <b-nav-item @click="op = 'addKeyQR'; ddShow = false"><span class="text-white">Сканировать QR</span>
            </b-nav-item>
            <b-nav-item @click="op = 'addKeyIn'; ddShow = false"><span class="text-white">Ввести новый ключ</span>
            </b-nav-item>
          </b-nav>
        </div>


      </div>

    </div>

    <div v-show="ddShow" class="text-left w-100 pl-3"
         style="position: absolute; bottom: 0px; font-size: 16pt;background: rgba(255,255,255,0.89);">
      <a target="_blank" href="https://smartholdem.io" class="small text-danger">
        {{$t('powered')}} <img width="18px" src="images/48x48.png"/> SmartHoldem v{{this.currentVersion()}}
      </a>
    </div>
  </div>
</template>

<script>
import QrScanImport2fa from '@/components/QrScanImport2fa.vue';
import AddNewKeyIn from '@/components/AddNewKeyIn.vue';
import AddNewKeyQr from '@/components/AddNewKeyQr.vue';
import {generateToken} from "node-2fa";

export default {
  name: 'Home',
  components: {
    QrScanImport2fa,
    AddNewKeyIn,
    AddNewKeyQr,
  },
  data() {
    return {
      op: 'home',
      ddShow: false,
      importResult: [],
      allKeys: [],
      timer: null,
      process: false,
      seconds: 0,
      totalSeconds: 32,
      timerTimeout: null,
      screenWidth: 480,
      selectedItem: null,
      submenu: null,
      itemRaw: null,
    }
  },
  computed: {
    storedKeys() {
      return this.$store.getters['keys2fa/faKeys'];
    }
  },
  methods: {
    async itemRawData(idx) {
      this.op = 'itemRawData';
      this.itemRaw = this.storedKeys[idx];
    },
    async itemDel(idx) {
      this.submenu = null;
      await this.$store.dispatch('keys2fa/itemDel', idx);
      await this.generateTokens();
    },
    jsonDownload() {
      let element = document.createElement('a');
      let url = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.storedKeys));
      element.setAttribute('href', url);
      element.setAttribute('download', 'smart2fa.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    async setLang(locale) {
      await this.$store.dispatch('app/setLanguage', locale);
    },

    async itemSelect(idx) {
      await this.doCopyText(this.allKeys[idx].token)
      this.selectedItem !== idx ? this.selectedItem = idx : this.selectedItem = null;
    },
    async makeToast(variant = null, title = 'Success', message = '') {
      this.$bvToast.toast(message, {
        title: title,
        toaster: 'b-toaster-top-right',
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
      if (this.storedKeys.length < 1) {
        return;
      }
      //console.log('generateTokens');
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
      await this.makeToast('success', 'Импорт', 'Добавлены ключи ' + data.length);
    });
  }
}
</script>

<style>
.btnBotAdd {
  position: absolute; bottom: 10px; right: 10px; z-index: 1000;
  width:42px;
  height: 42px;
}
.btnBotAdd:hover {
  cursor:pointer;
  opacity: 0.9;
}
.itemSubMenu {
  z-index: 100000;
  position: absolute;
  top: 6px;
  right: 24px;
  background: rgba(44, 62, 80, 0.82);
  padding: 12px;
  border-radius: 4px;
}

.item-2fa {
  top: 0;
  border-bottom: dashed 1px #76797c;
  padding-bottom: 4px;
  padding-top: 2px;
}

.item-2fa:active {
  background: linear-gradient(-45deg, #fbbe8d 1%, #4eabf7 48%, #fbbe8d);
  animation: blinker 1s linear;
}

.itemActive {
  text-shadow: 1px 1px 0.06em rgba(246, 244, 97, 0.6);
  background: linear-gradient(-45deg, #fbbe8d 1%, #4eabf7 48%, #fbbe8d) !important;
  border-bottom: 1px;
  border-bottom: solid 1px #1371ce;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.item-2fa:hover {
  /*background: linear-gradient(-45deg, #fbbe8d 1%, #4eabf7 48%, #fbbe8d);*/
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
