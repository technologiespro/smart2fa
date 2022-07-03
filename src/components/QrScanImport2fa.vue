<template>
  <div>
    <qrcode-stream style="width:200px; height:200px; border: solid 2px #333;" @decode="onDecode" @init="onInit" />
  </div>
</template>

<script>
'use strict';
document.addEventListener('deviceready', function() {
  let permissions = cordova.plugins.permissions;
  permissions.requestPermission(permissions.CAMERA, success, error);

  /*
  navigator.permissions.query({name: 'camera'})
      .then((permissionObj) => {
        console.log(permissionObj.state);
      })
      .catch((error) => {
        console.log('Got error :', error);
      })

   */
  /*
  navigator.getUserMedia (
      // constraints
      {
        video: true,
        audio: true
      },

      // successCallback
      function(localMediaStream) {
        var video = document.querySelector('video');
        video.src = window.URL.createObjectURL(localMediaStream);
        video.onloadedmetadata = function(e) {
          // Do something with the video here.
        };
      },

      // errorCallback
  );

   */

  /*
 var now = Date.now();
 navigator.mediaDevices.getUserMedia({audio: false, video: true})
     .then(function(stream) {
       console.log('Got stream, time diff :', Date.now() - now);
     })
     .catch(function(err) {
       console.log('GUM failed with error, time diff: ', Date.now() - now);
     });


  */
  navigator.mediaDevices.getUserMedia({video: true})
      .then(function(stream) {
        document.getElementById('camera').srcObject = stream;
      }).catch(function() {
    alert('could not connect stream');
  });

  function error() {
    console.warn('Camera permission is not turned on');
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
      console.log('parsedDataList', parsedDataList)
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