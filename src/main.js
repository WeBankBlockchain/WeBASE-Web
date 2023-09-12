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

import './public-path'
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
ElementUI.Dialog.props.lockScroll.default = false;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
// axios.defaults.timeout = 60 * 1000;
Vue.use(router);
Vue.use(VueClipboard);
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

// 新增：用于保存vue实例
let instance = null;

function render(props = {}) {
  const { container } = props;

  instance = new Vue({
    el: container ? container.querySelector('#app') : '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
  });
}


/**
 * 新增：
 * bootstrap 只会在微应用初始化的时候调用一次，
 下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("bcos3 bootstraped");
}

/**
 * 新增：
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("bcos3 mount", props);
  render(props);
}
/**
 * 新增：
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("bcos3 unmount");
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  // router = null;
}

// 新增：独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
