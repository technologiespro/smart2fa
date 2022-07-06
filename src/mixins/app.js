import packageJson from '../../package.json';

export default {
    methods: {
        currentVersion() {
            return packageJson.version;
        },
        async doCopyText(text) {
            await this.$copyText(text);
            this.$snotify.info(this.$t('copied'), {
                timeout: 800,
                showProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                position: 'leftBottom'
            });
        },
    }
}