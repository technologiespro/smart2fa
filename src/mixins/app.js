import packageJson from '../../package.json';
import os from 'os';

export default {
    data() {
        return {
            prevText: '',
        }
    },
    methods: {
        getOs() {
            return os.platform()
        },
        currentVersion() {
            return packageJson.version;
        },
        async doCopyText(text) {
            if (text !== this.prevText) {
                this.prevText = text;
                await this.$copyText(text);
                this.$snotify.info(this.$t('copied'), {
                    timeout: 800,
                    showProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    position: 'leftBottom'
                });
            }
        },
    }
}