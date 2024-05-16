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
import Vue from "vue";
import Vuex from "vuex";
import { getLanguage } from "@/lang/index";
import Cookies from "js-cookie";
import { getUserInfo } from "@/util/api";

Vue.use(Vuex);

const state = {
  creatUserVisible: false, //creat account
  isLogin: 0,
  loading: false,
  language: getLanguage(),
  importPrivateKey: false,
  version: null,
  mgrVersion: null,
  supportVersion: null,
  folders: [],
  contractDataList: [],
  worker: null,
  versionData: null,
  nodeList: [],
  exportRivateKey: false,
  exportProjectShow: false,
  selectedContracts: {},
  selectedContractInfo: {},
  bindKey: false,
  liquidCheck: false,
  permissions: [],
};
export default new Vuex.Store({
  state,
  getters: {
    not_show(state) {
      return !state.creatUserVisible;
    },
    language: (state) => state.language,
    permissions: (state) => state.permissions,
  },
  mutations: {
    switch_creat_user_dialog(state) {
      state.creatUserVisible = !state.creatUserVisible;
    },
    switch_import_private_key_dialog(state) {
      state.importPrivateKey = !state.importPrivateKey;
    },
    switch_bind_key_dialog(state) {
      state.bindKey = !state.bindKey;
    },
    switch_export_rivate_key_dialog(state) {
      state.exportRivateKey = !state.exportRivateKey;
    },
    changeLogin(state, status) {
      state.isLogin = status;
    },
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set("language", language);
    },
    set_version(state, name) {
      state.version = name;
    },
    set_mgr_version(state, name) {
      state.mgrVersion = name;
    },
    set_support_version(state, name) {
      state.supportVersion = name;
    },
    set_folders(state, data) {
      state.folders = data;
    },
    set_contract_dataList(state, data) {
      state.contractDataList = data;
    },
    set_worker(state, data) {
      state.worker = data;
    },
    set_version_data(state, data) {
      state.versionData = data;
    },
    set_node_list(state, data) {
      state.nodeList = data;
    },
    set_exportProject_show(state, data) {
      state.exportProjectShow = data;
    },
    set_selected_contracts(state, data) {
      state.selectedContracts = data;
    },
    set_selected_contracts_info(state, data) {
      state.selectedContractInfo = data;
    },
    set_liquidCheck(state, data) {
      state.liquidCheck = data;
    },
    set_permissions(state, permissions) {
      state.permissions = permissions;
    },
  },
  actions: {
    switch_liquidCheck(context, data) {
      context.commit("set_liquidCheck", data);
    },
    switch_bind_key_dialog(context) {
      context.commit("switch_bind_key_dialog");
    },
    switch_creat_user_dialog(context) {
      context.commit("switch_creat_user_dialog");
    },
    switch_import_private_key_dialog(context) {
      context.commit("switch_import_private_key_dialog");
    },
    switch_export_rivate_key_dialog(context) {
      context.commit("switch_export_rivate_key_dialog");
    },
    loginAction({ commit }) {
      commit("changeLogin", 1);
    },
    setLanguage({ commit }, language) {
      commit("SET_LANGUAGE", language);
    },
    set_version_action(context, name) {
      context.commit("set_version", name);
    },
    set_mgr_version_action(context, name) {
      context.commit("set_mgr_version", name);
    },
    set_support_version_action(context, name) {
      context.commit("set_support_version", name);
    },
    set_folders_action(context, data) {
      context.commit("set_folders", data);
    },
    set_contract_dataList_action(context, data) {
      console.log("store:", data);
      context.commit("set_contract_dataList", data);
    },
    set_worker_action(context, data) {
      context.commit("set_worker", data);
    },
    set_version_data_action(context, data) {
      context.commit("set_version_data", data);
    },
    set_node_list_action(context, data) {
      context.commit("set_node_list", data);
    },
    set_exportProject_show_action(context, data) {
      context.commit("set_exportProject_show", data);
    },
    set_selected_contracts_action(context, data) {
      context.commit("set_selected_contracts", data);
    },
    set_selected_contracts_info_action(context, data) {
      context.commit("set_selected_contracts_info", data);
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const user = res.data.data;
            commit("set_permissions", user.permissions);
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
