import axios from 'axios';

const state = {
  Order: {},
  CurSellerOrders: [],
  CurBuyerOrders: [],
  inPersonOrderID: null,
  codeConfirm: {},
};
const getters = {
  Order: (state) => state.Order,
  CurSellerOrders: (state) => state.CurSellerOrders,
  CurBuyerOrders: (state) => state.CurBuyerOrders,
  inPersonOrderID: (state) => state.inPersonOrderID,
  codeConfirm: (state) => state.codeConfirm
};
const actions = {
  async createInPersonOrder({ commit }, id) {
    const response = await axios({
      method: 'post',
      url: `/api/inPersonBuy/${id}`,
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    commit('setOrderID', response.data.orderID);
  },
  async createPickupCode({ dispatch, commit }, data) {
    await axios({
      method: 'post',
      url: `/api/generatePickupCode/${data.itemID}`,
      data: data,
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    dispatch('getOrders');
  },
  async confirmPickupCode({ commit, dispatch }, data) {
    const response = await axios({
      method: 'post',
      url: `/api/confirmPickupCode/${data.orderID}`,
      data: {
        code: data.code
      },
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    commit('codeConfirm', response.data)
    dispatch('getOrders');
  },
  async markItemAsPaid({ commit, dispatch }, data) {
    await axios({
      method: 'post',
      url: `/api/markItemAsPaid/${data.orderID}`,
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    dispatch('getOrders');
  },
  async createShippingOrder({ commit }, data) {
    await axios({
      method: 'post',
      url: `/api/createShippingOrder/${data.id}`,
      data: data.order,
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
  },
  async createShippingLabel({ dispatch, commit }, data) {
    await axios({
      method: 'post',
      url: `/api/createShippingLabel`,
      data: data,
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    dispatch('getOrders');
  },
  async getOrders({commit}) {
    const responseSeller = await axios({
      method: 'get',
      url: '/api/getOrders/',
      params: {ordersAs: 'seller'},
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    const responseBuyer = await axios({
      method: 'get',
      url: '/api/getOrders/',
      params: {ordersAs: 'buyer'},
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    commit('setCurSellerOrders', responseSeller.data);
    commit('setCurBuyerOrders', responseBuyer.data);
  },
  async getOrder({commit}, id) {
    const response = await axios({
      method: 'get',
      url: `/api/getOrder/${id}`,
      proxy: {
        host: 'localhost',
        port: 3000
      }
    })
    commit('setOrder', response.data)
  },
  async updateCurUserTrackingInfo({ commit, dispatch }) {
    await axios({
      method: 'post',
      url: '/api/updateCurUserAllTrackingInfo',
      proxy: {
        host: 'localhost',
        port: 3000
      }
    });
    dispatch('getOrders');
  },
};

const mutations = {
  setOrder: (state, order) => (state.Order = order),
  setCurSellerOrders: (state, orders) => (state.CurSellerOrders = orders),
  setCurBuyerOrders: (state, orders) => (state.CurBuyerOrders = orders),
  setOrderID: (state, orderID) => (state.inPersonOrderID = orderID),
  codeConfirm: (state, codeConfirm) => (state.codeConfirm = codeConfirm)
};

export default {
  state,
  getters,
  actions,
  mutations,
};