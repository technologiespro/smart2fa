<template>
  <div>
    <b-card bg-variant="light">
      <b-form-input v-model="name" :placeholder="$t('account_name')"></b-form-input>
      <b-form-input class="mt-2" v-model="secret" :placeholder="$t('enter_secret_key')"></b-form-input>

      <div class="mt-2">
        <b-button class="w-100" @click="AddKeyToApp" variant="outline-primary">{{$t('btn_add')}}</b-button>
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
      if (this.secret && this.name) {
        await eventBus.emit('qr:importKeys', [
          {
            secret: this.secret,
            name: this.name,
            issuer: '',
            algorithm: 'sha1',
            digits: 6,
            type: 'totp',
            period: 30,
            counter: { "low": 0, "high": 0, "unsigned": false }
          }
        ]);
      }
    }
  }
}
</script>

<style scoped>

</style>