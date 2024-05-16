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
import Axios from "axios";
import router from "../router";
import Cookies from "js-cookie";
import { MessageBox } from "element-ui";
let axiosIns = Axios.create({
  timeout: 60 * 1000,
});
// axiosIns.defaults.baseURL = 'http://127.0.0.1:8081';
axiosIns.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest";
// axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = "json";
// axiosIns.defaults.baseURL = 'http:127.0.0.1:8080'
axiosIns.defaults.validateStatus = function () {
  return true;
};

let isReloginShow = false;
// http response interceptor
axiosIns.interceptors.response.use(
  (response) => {
    // if (response.data && response.data.code === 302000) {
    //     router.push({
    //         path: '/login',
    //         query: { redirect: router.currentRoute.fullPath }
    //     })
    // }
    // if (response.data && (response.data.code === 202052 || response.data.code === 202053)) {
    //     router.push({
    //         path: "/login"
    //     })
    // }
    const code = response.data.code;
    if (code === 401) {
      if (!isReloginShow) {
        isReloginShow = true;
        MessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            isReloginShow = false;
            location.href = "/login";
          })
          .catch(() => {
            isReloginShow = false;
          });
      }
      return Promise.reject({
        data: "无效的会话，或者会话已过期，请重新登录。",
      });
    } else {
      return response;
    }
  },
  (error) => {
    if (error.message.includes("timeout")) {
      if (localStorage.getItem("lang") === "en") {
        error.data = "Timeout";
      } else {
        error.data = "请求超时";
      }
    }
    //     switch (error.response.status) {
    //         case 401:
    //             store.commit(types.LOGOUT);
    //             router.replace({
    //                 path: 'login',
    //                 query: {redirect: router.currentRoute.fullPath}
    //             })
    //     }
    // }
    return Promise.reject(error);
  }
);

export default {
  axiosIns,
};
/**post
 * @param options
 * @return {Promise}
 */
export function post(options) {
  return new Promise((resolve, reject) => {
    axiosIns(options)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
/**get
 * @param options
 * @return {Promise}
 */
export function get(options) {
  return new Promise((resolve, reject) => {
    axiosIns(options)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**patch
 * @param options
 * @return {Promise}
 */
export function patch(options) {
  return new Promise((resolve, reject) => {
    axiosIns(options)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
/**put
 * @param options
 * @return {Promise}
 */
export function put(options) {
  return new Promise((resolve, reject) => {
    axiosIns(options)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
/**delete
 * @param options
 * @return {Promise}
 */
export function deleted(options) {
  console.log("options", options);
  return new Promise((resolve, reject) => {
    axiosIns(options)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
