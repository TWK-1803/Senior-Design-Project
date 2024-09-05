import axios from 'axios';

const state = {

};
const getters = {

};
const actions = {
    async createRating({ commit, dispatch }, data) {
        await axios({
            method: 'post',
            url: `/api/createRating/${data.userID}`,
            data: {
                rating: data.rating,
            },
            proxy: {
              host: 'localhost',
              port: 3000
            }
        });
        dispatch('getOrders');
    },
};

const mutations = {

};

export default {
  state,
  getters,
  actions,
  mutations,
};