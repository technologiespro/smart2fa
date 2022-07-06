<template>
  <qrcode-stream @decode="onDecode" @init="onInit"/>
</template>

<script>


'use strict';
document.addEventListener('deviceready', function() {

  cordova.plugins.diagnostic.requestCameraAuthorization({
    success: success,
    error: error,
    externalStorage: false
  });

  navigator.mediaDevices.getUserMedia({video: true})
      .then(function(stream) {
        document.getElementById('camera').srcObject = stream;
      }).catch(function() {
    console.log('could not connect stream');

  });

  function error() {
    alert('Camera permission is not turned on');
  }

  function success( status ) {
    if( !status.hasPermission ) error();
  }
});

import {QrcodeStream} from 'vue-qrcode-reader'
import eventBus from '@/plugins/event-bus';
import * as OTPAuth from 'otpauth';

export default {
  name: "AddNewKeyQr",
  data() {
    return {
      importResult: [],
      error: "",
    }
  },
  components: {QrcodeStream},
  methods: {
    async addKeyFromQr(dataUri) {
      const parsedTotp = OTPAuth.URI.parse(dataUri);
      await eventBus.emit('qr:importKeys', [{
        algorithm: parsedTotp.algorithm,
        digits: parsedTotp.digits || 6,
        issuer: parsedTotp.issuer,
        name: parsedTotp.label,
        period: parsedTotp.period || 30,
        secret: parsedTotp.secret.base32,
        counter: { "low": 0, "high": 0, "unsigned": false }
      }])
    },
    async onDecode(result) {
      await this.addKeyFromQr(result);
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    }
  }
}
</script>

<style scoped>

</style>