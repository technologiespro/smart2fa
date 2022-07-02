<template>
  <div class="home">
    <div class="row">
      <div class="container">
        <b-button-group>
          <b-button>Добавить ключ</b-button>
          <b-button @click="op = 'importKeys'">Импортировать ключи</b-button>

          <div v-if="op === 'importKeys'">
            <b-form-textarea
                id="textarea"
                v-model="dataUri"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
            ></b-form-textarea>
            <b-button variant="outline-primary">Подтвердить импорт</b-button>

            <div>
              {{ importResult }}
            </div>
          </div>

        </b-button-group>
      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import parser from "otpauth-migration-parser";

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      op: null,
      dataUri: null,
      importResult: null,
    }
  },
  methods: {
    async migrationImport() {
      const parsedDataList = await parser(this.dataUri);
      this.importResult = [];
      for (let otpSecretInfo of parsedDataList) {
        this.importResult.push(otpSecretInfo);
        /* =>
          {
            secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
            name: 'sample',
            issuer: 'sample',
            algorithm: 'sha1',
            digits: 6,
            type: 'totp',
            counter: Long { low: 0, high: 0, unsigned: false }
          }
        */
      }
    }
  }
}
</script>
