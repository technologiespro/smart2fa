<template>
  <div class="p-2">
    <b-form-file
        v-model="file"
        :multiple="true"
        :state="Boolean(file)"
        :placeholder="$t('drop_file')"
        drop-placeholder="Drop file here..."
        accept=".json"
    ></b-form-file>

    <div class="mt-3" v-show="file">
      <b-form-input class="mt-2" v-model="secret" :placeholder="$t('enter_secret_key')"></b-form-input>
      <div class="mt-2">
        <b-button class="w-100" :disabled="!secret" @click="loadData" variant="primary">{{$t('btn_add')}}</b-button>
      </div>
    </div>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import eventBus from "@/plugins/event-bus";
export default {
  name: "ImportFromFile",
  data() {
    return {
      secret: '',
      file: null,
      fileValue: '',
      step: 0,
      decrypted: null,
    }
  },
  watch: {
    async decrypted(values) {
      if (values.length) {
        await eventBus.emit('qr:importKeys', values)
      }
    }
  },
  methods: {
    async loadData() {
      if (this.file) {
        const reader = new FileReader();
        reader.readAsText(this.file[0]);
        let _self = this
        reader.onload = async function() {
          _self.fileValue = JSON.parse(reader.result);
          let password = CryptoJS.SHA384(_self.secret).toString();
          try {
            let bytes  = CryptoJS.AES.decrypt(_self.fileValue.data, password);
            _self.decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          } catch(e) {
            _self.$snotify.error(_self.$t('password_not_valid'), {
              timeout: 3000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              position: 'leftBottom'
            });
          }
        };
      }
    }
  }
}
</script>

<style scoped>

</style>