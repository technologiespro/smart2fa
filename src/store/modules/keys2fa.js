/*
 * Copyright (c) 2022 TechnoL0g.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
//import _ from 'lodash';

import CryptoJS from 'crypto-js';

export default {
    namespaced: true,

    state: {
        faKeys: [],
        encryptedKeys: {
            encrypted: 'AES',
            data: "", //Json > string
        },
    },

    getters: {
        faKeys: state => state.faKeys,
        encryptedKeys: state => state.encryptedKeys,
    },

    mutations: {
        SET_ENCRYPTED_KEYS (state, payload) {
            state.encryptedKeys = payload;
        },
        SET_KEYS (state, payload) {
            let importResult = state.faKeys;
            for (let i = 0; i < payload.length; i++) {
                let isDublicate = false;
                for (let j = 0; j < importResult.length; j++) {
                    if (importResult[j].secret === payload[i].secret) {
                        isDublicate = true;
                    }
                }
                if (!isDublicate) {
                    importResult.push(payload[i]);
                }
            }
            state.faKeys = importResult;
            this.$store.dispatch('keys2fa/encryptKeysWithPin', importResult);

        },
        ITEM_DEL(state, payload) {
            let importResult = state.faKeys;
            importResult.splice(payload, 1);
            state.faKeys = importResult;
            this.$store.dispatch('keys2fa/encryptKeysWithPin', importResult);
        },
    },

    actions: {
        setKeys ({ commit }, value) {
            commit('SET_KEYS', value)
        },
        itemDel ({ commit }, value) {
            commit('ITEM_DEL', value)
        },
        // eslint-disable-next-line no-unused-vars
        encryptKeys({ commit }, password) {
            return {
                encrypted: 'AES',
                data: CryptoJS.AES.encrypt(JSON.stringify(this.getters['keys2fa/faKeys']),  CryptoJS.SHA384(password).toString()).toString(),
            };
        },
        // eslint-disable-next-line no-unused-vars
        encryptKeysWithPin({ commit }, faKeys) {
            const pin = this.getters['app/pin'];
            if (pin) {
                try {
                    const value = {
                        encrypted: 'AES',
                        data: CryptoJS.AES.encrypt(JSON.stringify(faKeys),  CryptoJS.SHA384(pin).toString()).toString(),
                    }
                    commit('SET_ENCRYPTED_KEYS', value)
                } catch(e) {
                    console.log('err encryptKeysWithPin')
                }
            }
        }
    }
}
