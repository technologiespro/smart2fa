<template>
  <div>
    <b-form-file
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
    ></b-form-file>
    <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>


  </div>
</template>

<script>
export default {
  name: "ImportFromFile",
  data() {
    return {
      file: null,
    }
  }
}
</script>

<style scoped>

</style>