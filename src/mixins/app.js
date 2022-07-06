import packageJson from '../../package.json';

export default {
    data() {
        return {
            prevText: '',
        }
    },
    methods: {
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