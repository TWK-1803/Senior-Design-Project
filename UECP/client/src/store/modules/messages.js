import axios from 'axios';

const state = {
  Conversations: [],
  Messages: [],
  ConversationID: ""
};
const getters = {
  Conversations: (state) => {
    state.Conversations.map(conversation => {
      conversation.user1ProfilePicture = `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_PROFILES_IMAGE_CONTAINER}/${conversation.user1ProfilePicture}`;
      conversation.user2ProfilePicture = `https://uecpimagestorage.blob.core.windows.net/${process.env.VUE_APP_PROFILES_IMAGE_CONTAINER}/${conversation.user2ProfilePicture}`;
    });
    return state.Conversations;
  },
  Messages: (state) => state.Messages,
  ConversationID: (state) => state.ConversationID
};
const actions = {
  async getConversations({commit}){                                                                                                                                                                                                                                                                                                                                                          
    const response = await axios.get(`/api/getConversations`, {
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    commit('setConversations', response.data)
  },
  async createConversation({commit}, userID){
    const response = await axios({ 
      method: 'post',
      url: `/api/createConversation/${userID}`,
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    commit('setConversationID', response.data)
  },
  async getConversationID({commit}, payload){
    const response = await axios.get(`/api/getConversationID/${payload.user1}/${payload.user2}`, {
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    commit('setConversationID', response.data)
  },
  async getMessages({commit}, conversationID){
    const response = await axios.get(`/api/getMessages/${conversationID}`, {
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    commit('setMessages', response.data.messages.sort((a,b) => a.createdAt - b.createdAt))
  },
  async sendMessage({dispatch}, payload){
    const response = await axios.post(`/api/sendMessage/${payload.conversationID}`, {
      payload: {
        senderID: payload.senderID,
        receiverID: payload.receiverID,
        text: payload.text
      },
      proxy: {
        host: "localhost",
        port: 3000,
      },
    })
    dispatch('getMessages', payload.conversationID);
  }
};

const mutations = {
  setConversations: (state, conversations) => (state.Conversations = conversations),
  setMessages: (state, messages) => (state.Messages = messages),
  setConversationID: (state, conversationID) => (state.ConversationID = conversationID)
};

export default {
  state,
  getters,
  actions,
  mutations,
};