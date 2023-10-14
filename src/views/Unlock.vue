<template>
  <div>
    <div class="overflow-hidden mt-auto mb-auto pt-5">
      <p class="mt-5 text-center">Unlock app</p>
      <div class="row p-3">
        <div class="container-fluid">
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group
                id="input-group-login"
                label="Pin Code"
                label-for="input-login"
                description="PIN code is required to decrypt your data"
            >
              <b-form-input
                  autofocus
                  style="-webkit-text-security:disc;text-security:disc;"
                  autocomplete="off"
                  id="input-login"
                  v-model="pin"
                  type="text"
                  placeholder="enter pin"
                  required
                  @change="validatePin"
                  @input="validatePin"
              ></b-form-input>
            </b-form-group>

            <div class="row">
              <div class="col-6">
                <b-button :disabled="!isValid" type="submit" variant="primary" class="w-100 text-uppercase">Unlock</b-button>
              </div>
              <div class="col-6">
                <b-button @click="show = false" variant="danger" class="w-100 text-uppercase">Reset All data?</b-button>
              </div>
            </div>




          </b-form>

          <div v-if="!show">
            <p class="text-danger">All your data, including created accounts will be removed from the app and reset to default.</p>

            <div class="row">
              <div class="col-6">
                <b-button @click="show = true" variant="primary" class="w-100 text-uppercase">Back</b-button>
              </div>
              <div class="col-6">
                <b-button @click="resetAll" variant="danger" class="w-100 text-uppercase">Confirm Reset?</b-button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Unlock",
  data() {
    return {
      show: true,
      isValid: false,
      pin: '',
      unlockTimer: null,
    }
  },
  methods: {
    async resetAll() {
      await this.$store.dispatch('resetData');
      await this.$store.dispatch('keys2fa/reset');
      setTimeout(async () => {
        await this.$router.push('/set-pin');
      }, 500);

    },
    async validatePin() {
      clearTimeout(this.unlockTimer);
      this.unlockTimer = setTimeout(async () => {
        this.isValid = await this.$store.dispatch('keys2fa/validatePinCode', this.pin);
        if (this.isValid) {
          this.$root.tmpPin = this.pin;
          await this.$router.push('/');
        }
        clearTimeout(this.unlockTimer);
      }, 200);
    },
    async onSubmit() {
      await this.validatePin();
    }
  }
}
</script>

<style scoped>

</style>
