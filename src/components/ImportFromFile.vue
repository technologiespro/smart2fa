<template>
  <div class="p-2">
    <b-form-file
        v-model="file"
        :multiple="true"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        @input="loadData"
        accept=".json"
    ></b-form-file>
    <div class="mt-3">{{decrypted}}</div>



    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
export default {
  name: "ImportFromFile",
  data() {
    return {
      file: null,
      fileValue: '',
      step: 0,
      decrypted: null,
    }
  },
  methods: {
    async loadData() {
      if (this.file) {
        let reader = new FileReader();
        reader.readAsText(this.file[0]);
        let _self = this
        reader.onload = async function() {
          _self.fileValue = JSON.parse(reader.result);
          let password = CryptoJS.SHA384('11111').toString();
          try {
            let bytes  = CryptoJS.AES.decrypt(_self.fileValue.data, password);
            _self.decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          } catch(e) {
            _self.$snotify.error('Password is not valid', {
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