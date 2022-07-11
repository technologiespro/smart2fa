<template>
  <div class="w-100">
    <b-navbar toggleable="lg" type="dark" variant="info" :sticky="true" fixed="top"
              style="position: fixed;background: linear-gradient(-45deg, #38096d 1%, #4eabf7 48%, #00cccf);">
      <b-navbar-brand><img width="24px" src="images/logo48.png"/> Smart2FA
        <span class="badge badge-success"
              style="border: solid 1px rgba(35,59,93,0.76);">{{ (seconds < 10 ? '0' + seconds : seconds) }}</span>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item @click="op = 'importKeys'; ddShow = false">
            <span class="text-white">{{ $t('import_from_google') }}</span>
          </b-nav-item>
          <b-nav-item v-show="isElectron" v-b-modal.modal-save-file>
            <span class="text-white">{{ $t('save_to_file') }}</span>
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto nav-lang">
          <!--
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          -->

          <b-nav-item-dropdown :text="$t('lang')" right class="text-white">
            <b-dropdown-item @click="setLang('ru')">RU</b-dropdown-item>
            <b-dropdown-item @click="setLang('en')">EN</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>
      </b-collapse>
    </b-navbar>


    <div v-if="op === 'importKeys'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 4% !important; margin: 0 !important; z-index: 200000;">
      <QrScanImport2fa
          style="margin-left: auto; margin-right: auto; width:250px; height:250px; border: solid 2px #333;margin-top: 50px;"/>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 25px;">
        <b-button @click="op = 'home'" :pill="true" variant="success">X</b-button>
      </div>
      <p class="text-white">{{ $t('google_migrate_info') }}</p>
    </div>

    <div v-if="op === 'addKeyIn'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 1% !important; margin: 0 !important;z-index: 200000; ">
      <AddNewKeyIn style="margin-left: auto; margin-right: auto; width:100%; margin-top: 8px;"/>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 10px;">
        <b-button @click="op = 'home'" :pill="true" variant="success">X</b-button>
      </div>
      <p class="text-white p-2">{{ $t('token_add_info_input') }}</p>
    </div>

    <div v-if="op === 'addKeyQR'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 4% !important; margin: 0 !important;z-index: 200000; ">
      <AddNewKeyQr
          style="margin-left: auto; margin-right: auto; width:250px; height:250px; border: solid 2px #333;margin-top: 50px;"/>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 125px;">
        <b-button @click="op = 'home'" :pill="true" variant="success">X</b-button>
      </div>
      <p class="text-white">{{ $t('token_add_info_qr') }}</p>
    </div>

    <div v-if="op === 'itemRawData'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.93); width: 100%; height: 100vh; position: absolute; top:0; padding: 4% !important; margin: 0 !important; z-index: 200000;">
      <p class="text-white">
        {{ itemRaw }}
      </p>
      <p class="text-center">
        <QrCode :options="{size:200}" :value="totpRaw" class="qr-raw-export"/>
      </p>
      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 10px;">
        <b-button @click="op = 'home'" :pill="true" variant="success">X</b-button>
      </div>
    </div>

    <div v-if="op === 'importFile'"
         style="backdrop-filter: blur(4px); background: rgba(43,68,87,0.63); width: 100%; height: 100vh; position: absolute; top:0; padding: 1% !important; margin: 0 !important;z-index: 200000; ">

      <div style="margin-left: auto; margin-right: auto;width:25px;margin-bottom: 5px; margin-top: 10px;">
        <b-button @click="op = 'home'" :pill="true" variant="success">X</b-button>
      </div>
      <ImportFromFile style="margin-left: auto; margin-right: auto; width:100%; margin-top: 6px;"/>

    </div>

    <div class="row">
      <div class="container" style="margin-top:55px;padding-bottom: 48px;position: relative;">
        <div class="w-100" style="background: rgb(193 51 162);position: fixed; margin-top: 0px">
          <span style="float: right;height: 5px;background: #1fab1a;"
                :style="'width:' + ((screenWidth * (seconds / totalSeconds * 100) / 100)) + 'px;'"></span>
        </div>

        <!-- ITEMS -->
        <div style="margin-top:5px;">
          <div v-for="(item, idx) in allKeys" v-bind:key="item.secret" class="w-100 pl-2 item-2fa"
               style="position: relative"
               @click="itemSelect(idx)" v-bind:class="{ itemActive: idx === selectedItem }">
            <div v-show="submenu === idx" class="itemSubMenu">
              <span @click="itemDel(idx)" class="badge badge-danger mr-3">DEL</span>
              <span @click="itemRawData(idx)" class="badge badge-info mr-3">RAW</span>
              <span @click="submenu = null" class="badge badge-warning text-uppercase">{{ $t('cancel') }}</span>
            </div>

            <span class="item-name" v-show="!item.name.includes(item.issuer)">{{ item.issuer }}</span> <span
              class="item-name">{{ item.name }}</span>
            <br/>

            <div @click="submenu !== idx ? submenu = idx : submenu = null" class="float-right pr-2">
              <b-icon icon="three-dots-vertical" font-scale="1"></b-icon>
            </div>
            <Transition>
              <span class="font-weight-bolder token">{{ item.token }}</span>
            </Transition>
          </div>
        </div>

        <!-- ITEMS END -->


      </div>

    </div>

    <img @click="ddShow = !ddShow" class="btnBotAdd" src="images/add.png"/>
    <div v-show="ddShow"
         style="border-radius: 6px 6px 0 6px; position: absolute; bottom: 56px;right: 15px; background: linear-gradient(-45deg, #38096d 1%, #4eabf7 48%, #00cccf);">
      <b-nav vertical class="w-100">
        <b-nav-item @click="op = 'addKeyQR'; ddShow = false"><span class="text-white">{{ $t('qr_scan') }}</span></b-nav-item>
        <b-nav-item @click="op = 'addKeyIn'; ddShow = false"><span class="text-white">{{ $t('enter_key') }}</span></b-nav-item>
        <b-nav-item @click="op = 'importFile'; ddShow = false"><span class="text-white">{{$t('import_from_file')}}</span></b-nav-item>
      </b-nav>
    </div>

    <div v-show="ddShow" class="text-left w-100 pl-3"
         style="position: absolute; bottom: 0px; font-size: 16pt;background: rgba(255,255,255,0.89);">
      <a ref="aUrl" target="_blank" href="https://smartholdem.io" class="small text-dark">
        {{ $t('powered') }} <img width="18px" src="images/48x48.png"/> SmartHoldem v{{ currentVersion() }}
      </a>
    </div>

    <b-modal
        id="modal-save-file"
        ref="modal"
        :title="$t('crypt_file_password')"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >
      <form ref="form">
        <b-form-group
        >
          <b-form-input
              id="password-input"
              v-model="password"
              :placeholder="$t('crypt_password')"
              required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
function vbr(ms = 250) {
  navigator.vibrate(ms);
}

import QrScanImport2fa from '@/components/QrScanImport2fa.vue';
import AddNewKeyIn from '@/components/AddNewKeyIn.vue';
import AddNewKeyQr from '@/components/AddNewKeyQr.vue';
import ImportFromFile from '@/components/ImportFromFile.vue';

import {generateToken} from 'node-2fa';
import * as OTPAuth from 'otpauth';
import QrCode from '@/util/QRCode';

export default {
  name: 'Home',
  components: {
    QrScanImport2fa,
    AddNewKeyIn,
    AddNewKeyQr,
    QrCode,
    ImportFromFile,
  },
  data() {
    return {
      isElectron: process.env.IS_ELECTRON,
      isNode: process.env.NODE_ENV,
      op: 'home',
      ddShow: false,
      importResult: [],
      allKeys: [],
      timer: null,
      seconds: 0,
      totalSeconds: 32,
      timerTimeout: null,
      screenWidth: 480,
      selectedItem: null,
      submenu: null,
      itemRaw: null,
      totpRaw: null,
      currentTime: 0,
      dateSeconds: 0,
      password: '',
    }
  },
  computed: {
    storedKeys() {
      return this.$store.getters['keys2fa/faKeys'] || [];
    }
  },
  methods: {
    async itemRawData(idx) {
      this.op = 'itemRawData';
      this.itemRaw = this.storedKeys[idx];
      this.totpRaw = (new OTPAuth.TOTP({
        issuer: this.storedKeys[idx].issuer,
        label: this.storedKeys[idx].name,
        algorithm: this.storedKeys[idx].algorithm,
        digits: this.storedKeys[idx].digits,
        period: this.storedKeys[idx].period,
        secret: this.storedKeys[idx].secret,
      })).toString();
    },
    async itemDel(idx) {
      this.submenu = null;
      await this.$store.dispatch('keys2fa/itemDel', idx);
      await this.generateTokens();
    },

    async setLang(locale) {
      await this.$store.dispatch('app/setLanguage', locale);
    },

    async itemSelect(idx) {
      await this.doCopyText(this.allKeys[idx].token)
      this.selectedItem !== idx ? this.selectedItem = idx : this.selectedItem = null;
      await this.generateTokens();
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
    },

    async generateTokens() {
      if (this.storedKeys.length < 1) {
        return;
      }
      clearInterval(this.timer);
      clearTimeout(this.timerTimeout);
      await this.regenerateTokens();

      this.seconds = this.totalSeconds;
      await this.timeSync(); // синхронизация секунд с таймером

      this.timer = setInterval(async () => {
        this.seconds = this.seconds - 1;
        if (this.seconds < 0) {
          this.seconds = this.totalSeconds;
          await this.generateTokens();
        }
      }, 1000);
    },

    async timeSync() {
      let date = new Date(Date.now());
      this.dateSeconds = date.getUTCSeconds();
      this.currentTime = 60 - this.dateSeconds;
      this.currentTime >= 30 ? this.currentTime = this.currentTime - 30 : this.currentTime;
      this.seconds = this.currentTime; // + timeSecCorrection // вероятно добавить в след версии
    },
    /** Save To File **/

    async jsonDownload() {
      let element = document.createElement('a');
      const data = await this.$store.dispatch('keys2fa/encryptKeys', this.password)
      let url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
      element.setAttribute('href', url);
      element.setAttribute('download', 'smart2fa.json');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    resetModal() {
      this.password = '';
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.password) {
        return
      }
      this.jsonDownload();
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-save-file')
      })
    }
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

      this.$snotify.success(this.$t('keys_added') + ' - ' + data.length, {
        timeout: 3000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        position: 'leftBottom'
      });
      vbr();
    });
  }
}
</script>

<style>
.item-name {
  font-weight: normal;
}

.btnBotAdd {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  width: 36px;
  height: 36px;
}

.btnBotAdd:hover {
  cursor: pointer;
  opacity: 0.9;
}

.itemSubMenu {
  z-index: 200000;
  position: absolute;
  top: 6px;
  right: 24px;
  background: rgba(44, 62, 80, 0.82);
  padding: 12px;
  border-radius: 4px;
}

.item-2fa {
  z-index: 0;
  top: 0;
  border-bottom: dashed 1px #76797c;
  padding-bottom: 4px;
  padding-top: 2px;
}

.item-2fa:active {
  /*background: linear-gradient(-45deg, #fbbe8d 1%, #4eabf7 48%, #fbbe8d);*/
  animation: blinker 1s linear;
}

.itemActive {
  /* text-shadow: 1px 1px 0.06em rgba(246, 244, 97, 0.6);*/
  background: linear-gradient(-45deg, #9aebef 20%, #ffffff) !important;
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
  font-size: 18pt;
  color: #224191;
  /*text-shadow: 1px 1px 0.06em rgba(226, 246, 97, 0.6);*/
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

.nav-lang .nav-link {
  color: #fff;
}
</style>
