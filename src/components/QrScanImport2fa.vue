<template>
    <qrcode-stream @decode="onDecode" @init="onInit" />
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



import parser from "otpauth-migration-parser";
import {QrcodeStream} from 'vue-qrcode-reader'
import eventBus from '@/plugins/event-bus';

export default {
  name: "QrScanImport2fa",
  data() {
    return {
      importResult: [],
      error: "",
    }
  },
  components: { QrcodeStream },
  methods: {
    async migrationImport(dataUri) {
      const parsedDataList = await parser(dataUri);
      let result = [];
      for (let otpSecretInfo of parsedDataList) {
        result.push(otpSecretInfo);
        /* =>
          {
            secret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
            name: 'sample',
            issuer: 'sample',
            algorithm: 'sha1',
            digits: 6,
            type: 'totp',
            counter: Long { low: 0, high: 0, unsigned: false }
          }
        */
      }

      await eventBus.emit('qr:importKeys', result)

    },
    async onDecode (result) {
      await this.migrationImport(result);
    },
    async onInit (promise) {
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