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
            <b-button :disabled="!isValid" type="submit" variant="primary" class="text-uppercase">Unlock</b-button>
          </b-form>
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
    async validatePin() {
      clearTimeout(this.unlockTimer);
      this.unlockTimer = setTimeout(async () => {
        this.isValid = await this.$store.dispatch('keys2fa/validatePinCode', this.pin);
        if (this.isValid) {
          this.$root.tmpPin = this.pin;
          await this.$router.push('/');
        }
      }, 200);


    },
    onSubmit() {

    }
  }
}
</script>

<style scoped>

</style>
