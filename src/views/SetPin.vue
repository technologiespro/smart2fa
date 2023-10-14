<template>
  <div>
    <NavBar/>
    <div class="overflow-hidden mt-auto mb-auto pt-5">
      <p class="mt-5 text-center">Set Pin Code</p>

      <div class="row p-3">
        <div class="container-fluid">
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group
                id="input-group-1"
                label="Enter Pin Code"
                label-for="input-1"
                description="PIN code is required to encrypt your data"
            >
              <b-form-input
                  style="-webkit-text-security:disc;text-security:disc;"
                  autocomplete="off"
                  id="input-1"
                  v-model="form.pin1"
                  type="text"
                  placeholder="enter pin"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Repeat Pin Code" label-for="input-2">
              <b-form-input
                  style="-webkit-text-security:disc;text-security:disc;"
                  autocomplete="off"
                  id="input-2"
                  v-model="form.pin2"
                  placeholder="repeat pin"
                  required
              ></b-form-input>
            </b-form-group>


            <b-button :disabled="form.pin1 !== form.pin2 || form.pin2.length < 4" type="submit" variant="primary" class="text-uppercase">Continue</b-button>
          </b-form>
        </div>

      </div>



    </div>

  </div>
</template>

<script>
import NavBar from '@/components/NavBar';

export default {
  name: "Register",
  components: {
    NavBar
  },
  data() {
    return {
      form: {
        pin1: '',
        pin2: '',
      },
      show: true
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      //alert(JSON.stringify(this.form))
      await this.$store.dispatch('app/setPin', this.form.pin1);
      await this.$router.push('/');
    },
  }
}
</script>

<style scoped>

</style>
