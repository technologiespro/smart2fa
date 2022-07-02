<template>
  <div class="home">

    <b-button pill variant="primary">+</b-button>
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
  methods: {
    async migrationImport(dataUri) {
      const parsedDataList = await parser(dataUri);
      for (let otpSecretInfo of parsedDataList) {
        console.log(otpSecretInfo);
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
