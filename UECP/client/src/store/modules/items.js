import axios from 'axios';

const state = {
    Item: {},
    Items: [],
    CurUserItems: [],
    CurUserSoldItems: [],
    CurUserBoughtItems: [],
    Categories: [],
    TypeOfDeals: [],
    ItemConditions: [],
    ShippingCarriers: {},
    ItemTypes: []
  };
const getters = {
    AllItems: (state) => {
        return state.Items.map( item => {
            let images = [{}]
            let count = 0;

            if(item.images){
                item.images.forEach(element => {
                    if (count == 0){
                        images[count] = {
                            url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
                        };
                    }
                    else{
                        images[count] = {
                            url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
                        }
                    }
                    count += 1;
                })
            }

            return{
                ...item,
                images
            }
        })
    },
    AllCategories: (state) => state.Categories,
    AllTypeOfDeals: (state) => state.TypeOfDeals,
    AllTypes: (state) => state.ItemTypes,
    AllConditions: (state) => state.ItemConditions,
    Item: (state) => {
      let images = [{}]
      let count = 0;

      if(state.Item.images){
        state.Item.images.forEach(element => {
          images[count] = {
            url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
          }
          count += 1;
        })
      }
      state.Item.images = images;
      return state.Item;
    },
    CurUserItems: (state) => {
      return state.CurUserItems.map( item => {
        let images = [{}]
        let count = 0;

        if(item.images){
          item.images.forEach(element => {
            if (count == 0){
              images[count] = {
                url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
              };
            }
            else{
              images[count] = {
                url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
              }
            }
            count += 1;
          })
        }

        return{
          ...item,
          images
        }
      })
    },
    CurUserSoldItems: (state) => {
      return state.CurUserSoldItems.map( item => {
        let images = [{}]
        let count = 0;

        if(item.images){
          item.images.forEach(element => {
            if (count == 0){
              images[count] = {
                url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
              };
            }
            else{
              images[count] = {
                url: `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_IMAGE_CONTAINER}/${element}`
              }
            }
            count += 1;
          })
        }

        return{
          ...item,
          images
        }
      })
    },
    CurUserBoughtItems: (state) => state.CurUserBoughtItems,
    CarrierServices: (state) => state.ShippingCarriers,
  };
  const actions = {
    async getProducts({ commit }, queryParams){
      const response = await axios({
        method: "get",
        url: `/api/getItem`,
        params: queryParams,
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      commit('setItems', response.data)
    },
    async createItem({ commit }, formData){
      const response = await axios.post(`/api/createItem`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      }, formData);
      commit ('newItem', response.data)
    },
    async getCategories({commit}){
      const response = await axios.get(`/api/getCategories`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      commit('setCategories', response.data)
    },
    async getTypeOfDeals({commit}){
      const response = await axios.get(`/api/getTypeOfDeals`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      commit('setDeals', response.data)
    },
    async getItemConditions({commit}){
      const response = await axios.get(`/api/getConditions`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      commit('setConditions', response.data)
    },

    async getItemTypes({commit}){
      const response = await axios.get(`/api/getTypes`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      commit('setTypes', response.data)
    },

    async getItem({dispatch, commit}, id) {
      const response = await axios.get(`/api/getItem/${id}`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      dispatch('getSellerInfo', response.data.sellerID)
      commit('setItem', response.data)
    },
    async deleteItem({commit}, id){
      await axios.delete(`/api/deleteItem/${id}`, {
        proxy: {
          host: "localhost",
          port: 3000,
        },
      })
      commit('removeItem', id)
    },
    async editItem({commit}, data){
      const response = await axios({ 
        method: 'put',
        url: `/api/updateItem/${data.id}`,
        data: data.formData,
        proxy: {
          host: "localhost",
          port: 3000,
        }
      });
      commit('updateItem', response.data)
    },
    async getShippingCarrierServices({ commit }) {
      const response = await axios.get('/api/getCarrierServices', {
        proxy: {
          host: "localhost",
          port: 3000,
        }
      });
      commit('setShippingCarriers', response.data);
    },
    async getCurUserItems({ commit }) {
      const response = await axios({
        method: 'get',
        url: '/api/getCurUserItems',
        proxy: {
          host: "localhost",
          port: 3000,
        }
      });
      commit('setCurUserItems', response.data.filter((item) => {return item.sold == false}));
      commit('setCurUserSoldItems', response.data.filter((item) => {return item.sold == true}));
    },
    async getCurUserBoughtItems({ commit }) {
      const response = await axios({
        method: 'get',
        url: '/api/getCurUserBoughtItems',
        proxy: {
          host: "localhost",
          port: 3000,
        }
      });
      commit('setCurUserBoughtItems', response.data);
    },
  };
  const mutations = {
    //Fill array with Items
    setItems: (state, items) => (state.Items = items),
    //Add a new Item into Items array
    newData: (state, Item) => state.Items.unshift(Item),
    //fill array with categories
    setCategories: (state, categories) => (state.Categories = categories),
    //fill array with type of deals
    setDeals: (state, typeOfDeals) => (state.TypeOfDeals = typeOfDeals),
    setItem: (state, item) => (state.Item = item),
    setConditions: (state, condition) => (state.ItemConditions = condition),
    setTypes: (state, type) => (state.ItemTypes = type),
    removeItem: (state, id) => state.Items.filter(item => item.id !== id),
    updateItem: (state, item) => state.Items.unshift(item),
    setCurUserItems: (state, curUserItems) => (state.CurUserItems = curUserItems),
    setCurUserSoldItems: (state, curUserSoldItems) => (state.CurUserSoldItems = curUserSoldItems),
    setCurUserBoughtItems: (state, curUserBoughtItems) => (state.CurUserBoughtItems = curUserBoughtItems),
    setShippingCarriers: (state, shippingCarriers) => (state.ShippingCarriers = shippingCarriers),
  };

  export default {
    state,
    getters,
    actions,
    mutations,
  };