<template>
  <div>
    <b-form-file
        v-model="file"
        :multiple="true"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        @input="loadData"
        accept=".json"
    ></b-form-file>
    <div class="mt-3">{{ fileValue }}</div>



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
    }
  },
  methods: {
    async loadData() {
      if (this.file) {
        let reader = new FileReader();
        reader.readAsText(this.file[0]);
        let _self = this
        reader.onload = async function() {
          _self.fileValue = reader.result;
        };
      }

    }
  }
}
</script>

<style scoped>

</style>