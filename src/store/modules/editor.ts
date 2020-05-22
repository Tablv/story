import { Module, GetterTree, MutationTree, ActionTree } from "vuex";

const state = {};

const getters: GetterTree<any, any> = {};

const mutations: MutationTree<any> = {};

const actions: ActionTree<any, any> = {};

const module: Module<any, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default module;
