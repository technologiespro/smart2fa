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
  components: {

  },
  data() {
    return {
      op: null,
      dataUri: null,
    }
  },
  methods: {
    async migrationImport() {
      const parsedDataList = await parser(this.dataUri);
      let result = [];
      for (let otpSecretInfo of parsedDataList) {
        result.push(otpSecretInfo);
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
      return result;
    }
  }
}
</script>
