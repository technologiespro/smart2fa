<template>
  <div>
    <b-card bg-variant="light">
      <b-form-input v-model="name" placeholder="Название аккаунта"></b-form-input>
      <b-form-input class="mt-2" v-model="secret" placeholder="Укажите ключ"></b-form-input>

      <div class="mt-2">
        <b-button>Отмена</b-button>
        <b-button @click="AddKeyToApp" variant="outline-primary">Добавить</b-button>
      </div>

    </b-card>
  </div>
</template>

<script>
import eventBus from "@/plugins/event-bus";

export default {
  name: "AddNewKeyIn",
  data() {
    return {
      name: "",
      secret: ""
    }
  },

  methods: {
    async AddKeyToApp() {
      let result = [
        {
          secret: this.secret,
          name: this.name,
          issuer: '',
          algorithm: 'sha1',
          digits: 6,
          type: 'totp',
          counter: 0,
        }
      ];
      await eventBus.emit('qr:importKeys', result)
    }
  }
}
</script>

<style scoped>

</style>