<template>
  <div>
      <b-form-input v-model="name" placeholder="Название аккаунта"></b-form-input>
      <b-form-input v-model="secret" placeholder="Укажите ключ"></b-form-input>
  </div>
</template>

<script>
export default {
  name: "AddNewKey",
  data() {
    return {
      name: "",
      secret: ""
    }
  }
}
</script>

<style scoped>

</style>