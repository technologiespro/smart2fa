import { merge } from 'lodash'

const mixins = [
    require('./app').default,
];

export default merge(...mixins)