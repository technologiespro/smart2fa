<template>
  <div>
    <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Submit Your Name"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
            label="Password"
            label-for="password-input"
        >
          <b-form-input
              id="password-input"
              v-model="password"
              required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "ExportToFile",
  props: {
    keys: Array
  },
  data() {
    return {
      password: '',
    }
  },
  methods: {
    resetModal() {
      this.password = '';
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.password) {
        return
      }

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    }
  },
  async created() {
    this.password = '';
  }
}
</script>

<style scoped>

</style>