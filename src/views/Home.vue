<template>
  <div class="home">
    <div class="row">
      <div class="container-fluid">
        <span class="badge badge-info float-left">{{allKeys.length}}</span>
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

    <div class="mt-1" style="height:700px; overflow-y:auto">
      <div v-for="item in allKeys" v-bind:key="item.secret">
        {{ item.name }}
        <hr/>
      </div>
    </div>
  </div>
</template>

<script>
import QrScanImport2fa from '@/components/QrScanImport2fa.vue'


export default {
  name: 'Home',
  components: {QrScanImport2fa},
  data() {
    return {
      op: null,
      importResult: [],
    }
  },
  computed: {
    allKeys() {
      return (this.$store.getters['keys2fa/faKeys'])
    }
  },
  methods: {},
  async created() {
    //this.allKeys = this.$store.getters['keys2fa/faKeys'];
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


      //this.importResult = data;
      await this.$store.dispatch('keys2fa/setKeys', this.importResult);
      //this.allKeys = this.$store.getters['keys2fa/faKeys'];
    });


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
