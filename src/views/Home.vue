<template>
  <div class="home">
    <div class="row">
      <div class="container-fluid">
        <b-button-group>
          <b-button @click="op = 'addKey'">Добавить</b-button>
          <b-button @click="op = 'importKeys'">Импортировать</b-button>
        </b-button-group>
      </div>


      <div class="ml-auto mr-auto">
        <div v-if="op === 'importKeys'">
          <p>Импорт ключейн из Google Auth</p>
          <p><QrScanImport2fa/></p>
        </div>
      </div>


    </div>

    <div style="height:472px; overflow-y:auto">
    <div v-for="(item, idx) in importResult" v-bind:key="idx">
      {{item}}
      <hr/>
    </div>
    </div>

  </div>
</template>

<script>
import QrScanImport2fa from '@/components/QrScanImport2fa.vue'


export default {
  name: 'Home',
  components: { QrScanImport2fa },
  data() {
    return {
      op: null,
      importResult: [],
    }
  },
  methods: {

  },
  async created() {
    await this.$eventBus.on('qr:importKeys', async (data) => {
      this.importResult = data;
      //await this.$store.dispatch('keys2fa/setKeys', data)
    });
  }
}
</script>

<style>
  .home {
    max-width:480px;
    height: 768px;
    border:solid 1px #ccc;
    margin-left: auto;
    margin-right: auto;
  }
</style>
