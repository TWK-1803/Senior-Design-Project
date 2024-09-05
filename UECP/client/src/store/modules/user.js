import axios from 'axios';

const state = {
  CurrentUser: {},
  SellerInfo: {}
};
const getters = {
  CurrentUser: (state) => {
    state.CurrentUser.profilePicture = `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_PROFILES_IMAGE_CONTAINER}/${state.CurrentUser.profilePicture}`;
    return state.CurrentUser;
  },
  SellerInfo: (state) => {
    state.SellerInfo.profilePicture = `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_PROFILES_IMAGE_CONTAINER}/${state.SellerInfo.profilePicture}`;
    return state.SellerInfo;
  }
};
const actions = {
  async updateCurUserAddress({ dispatch, commit }, formData) {
    const responseUpdate = await axios({
      method: "post",
      url: '/api/updateCurUserAddress',
      data: formData,
      proxy: {
        host: "localhost",
        port: 3000,
      }
    });
    // await dispatch('getCurrentUser');
  },
  async updateCurUserInfo({ dispatch, commit }, formData) {
    const responseUpdate = await axios({
      method: "post",
      url: '/api/updateCurUserInfo',
      data: formData,
      proxy: {
        host: "localhost",
        port: 3000,
      }
    });
    await dispatch('getCurrentUser');
  },
  async skipCurUserAddressOnboarding() {
    await axios({
      method: "post",
      url: '/api/skipCurUserAddressOnboarding',
      proxy: {
        host: "localhost",
        port: 3000,
      }
    })
  },
  async skipCurUserPayPalOnboarding() {
    await axios({
      method: "post",
      url: '/api/skipCurUserPayPalOnboarding',
      proxy: {
        host: "localhost",
        port: 3000,
      }
    })
  },
  async getCurrentUser({ commit }){
    const response = await axios.get(`/api/getCurrentUser`, {
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    commit('setCurrentUser', response.data)
  },
  async getSellerInfo({commit}, id){
    const response = await axios.get(`/api/getSellerInfo/${id}`, {
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    commit('setSellerInfo', response.data)
  },
};

const mutations = {
  setCurrentUser: (state, user) => (state.CurrentUser = user),
  setSellerInfo: (state, user) => (state.SellerInfo = user),
};

export default {
  state,
  getters,
  actions,
  mutations,
};