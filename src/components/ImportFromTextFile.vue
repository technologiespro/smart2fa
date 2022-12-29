<template>
  <div class="p-2">
    <b-form-file
        v-model="file"
        :multiple="true"
        :state="Boolean(file)"
        :placeholder="$t('drop_file')"
        drop-placeholder="Drop file here..."
        accept=".txt"
    ></b-form-file>
    <div class="mt-3" v-show="file">
      <div class="mt-2">
        <b-button class="w-100" @click="loadData" variant="primary">{{ $t('btn_add') }}</b-button>
      </div>
    </div>
    <p class="text-white p-2">{{ $t('import_from_text_info') }}</p>
    <vue-snotify></vue-snotify>
  </div>
</template>

<script>
import eventBus from "@/plugins/event-bus";

export default {
  name: "ImportFromTextFile",
  data() {
    return {
      file: null,
      fileValue: '',
      keys: [],
    }
  },
  watch: {
    async keys(values) {
      if (values.length) {
        await eventBus.emit('qr:importKeys', values);
        console.log('filev', values);
      }
    }
  },
  async created() {
    this.file = null;
    this.fileValue = '';
  },
  methods: {
    async loadData() {
      if (this.file) {
        const reader = new FileReader();
        reader.readAsText(this.file[0]);
        let _self = this;
        reader.onload = async function () {
          const keys = [];
          _self.fileValue = String(reader.result).replace("\r\n", "\n").split("\n");
          _self.fileValue.forEach(key => {
            if(key.includes('totp')) {
              let key_string = key.replace('otpauth://totp/', '');
              key_string = key_string.split('?');
              const title = key_string[0];
              const info = new URLSearchParams('?'+key_string[1]);
              const key_object = {
                name: title,
              };
              for(let pair of info.entries()) {
                // use switch to get object info manually, or just
                // use key_object[pair[0]] = pair[1],
                // but it's better to do it manually in order to validate the keys with it
                switch(pair[0]) {
                  case 'digits':
                    key_object['digits'] = pair[1];
                  break;

                  case 'issuer':
                    key_object['issuer'] = pair[1];
                  break;

                  case 'secret':
                    key_object['secret'] = pair[1];
                  break;

                  case 'period':
                    key_object['period'] = pair[1];
                  break;

                  case 'algorithm':
                    key_object['algorithm'] = pair[1];
                  break;
                }
              }
              if(!('issuer' in key_object)) {
                if(title.includes(':')) {
                  const title_split = title.split(':');
                  key_object['issuer'] = title_split[0];
                }
              }
              keys.push(key_object);
            } else {
              _self.$snotify.error(_self.$t('only_totp'), {
                timeout: 3000,
                showProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                position: 'leftBottom'
              });
            }
          });
          if(keys && keys.length > 0) {
            _self.keys = keys;
          }
          console.log(_self.keys);
        };
      }
    }
  }
}
</script>

<style scoped>

</style>