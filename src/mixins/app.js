import packageJson from '../../package.json';

export default {
    currentVersion() {
        return packageJson.version;
    },
    async doCopyText(text) {
        await this.$copyText(text);
        this.$snotify.info('Copied', {
            timeout: 1000,
            showProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            position: 'rightBottom'
        });
    },
}