/*
 * Copyright 2014-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import { getCookie, setCookie, delCookie } from './util/util'
import JsonViewer from "vue-json-viewer"
import errcode from './util/errcode'
import VueClipboard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
/*iconfont*/
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'
import '@/assets/icon/iconfont_webaas.css'
/*public css moudle */
import '@/assets/css/common.css'
import '@/util/directives.js';
import Clickoutside from 'element-ui/src/utils/clickoutside'
import filters from './util/filter.js'
import Cookies from 'js-cookie'
import i18n from './lang' // internationalization
import './svgIcons'
import dataV from '@jiaminghi/data-view';
Vue.use(dataV);
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
import 'lib-flexible/flexible'
import fullscreen from 'vue-fullscreen'
Vue.use(fullscreen)


import ace from 'ace-builds'
import { chooseLang } from "./util/errcode.js";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.config.productionTip = false;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
// axios.defaults.timeout = 60 * 1000;
Vue.use(router);
Vue.use(VueClipboard);
ElementUI.Dialog.props.closeOnClickModal.default=false
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium', // set element-ui default size
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(JsonViewer)
Vue.use(ace)
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(Clickoutside)
Vue.use(mavonEditor)
import promise from 'es6-promise';
//compatible Promise
promise.polyfill();
//cookie function
Vue.prototype.getCookie = getCookie;
Vue.prototype.setCookie = setCookie;
Vue.prototype.delCookie = delCookie;
//error code
Vue.prototype.errcode = errcode;
Vue.prototype.$chooseLang = chooseLang;
// lodash
import _ from 'lodash';
Vue.prototype._ = _;
import { message } from '@/util/message.js';
Vue.prototype.$message = message;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
});
