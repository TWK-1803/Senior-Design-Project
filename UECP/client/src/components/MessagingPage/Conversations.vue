<template>
 <div class="row">
    <div class="col-md">
        <div class="conversations m-4">
        <div class="conversation mt-2" v-for="conversation in Conversations" :key="conversation" @click="ViewConversation(conversation._id)">
            <img :src="conversation.profilePicture" class="rounded-circle profile-pic" alt="..." v-if="conversation.profilePicture.split('/').slice(-1)[0] !== 'undefined'">
            <p class=" mx-2 username">{{ conversation.username }}</p>
        </div>
    </div>
    </div>
 </div>
</template>

<script>

export default{
    name: "Conversations",
    data(){
        return{
        }
    },
    mounted(){
        this.$store.dispatch('getCurrentUser')
        this.$store.dispatch('getConversations')
    },
    computed:{
        Conversations(){
            let result = [];
            if (Object.keys(this.$store.getters.Conversations).length !== 0){
                this.$store.getters.Conversations.forEach(conversation => {
                    if(this.CurrentUser._id === conversation.user1){
                        result.push({_id: conversation._id, username: conversation.user2Username, profilePicture: conversation.user2ProfilePicture})
                    }
                    else{
                        result.push({_id: conversation._id, username: conversation.user1Username, profilePicture: conversation.user1ProfilePicture})
                    }
                })
            };
            return result;
        },
        CurrentUser(){
            return this.$store.getters.CurrentUser;
        }
    },
    methods:{
        ViewConversation(conversationID){
            this.$router.replace({name: 'messaging', params: {conversationid: conversationID}})
        }
    },
}
</script>

<style scoped>
.username{
    width: 100%;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    margin: auto;
}
.profile-pic{
    height: 80px;
    width: 80px;
    object-fit: cover;
}
.conversations{
    overflow: auto;
}
.conversation{
    border-radius: 5px;
    display: flex;
    flex-direction: row;
}
.conversation:hover{
    background-color: #d5d5d5;
}
.conversation:active{
    background-color: #d5d5d5;
    scale: 99%;
}
@media only screen and (max-width: 771px){
    .conversation{
        display: inline-block;
        margin-left: 10px;
    }
}
</style>