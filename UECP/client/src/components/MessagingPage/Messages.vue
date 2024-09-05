<template>
    <div class="row">
        <div class="col-md mt-3">
            <div class="messages m-4">
                <loadingSpinner v-if="loading === true"/>
                <div class="message mb-2" v-for="message in Conversation" :key="message._id" v-if="loading === false">
                    <div :class="message.senderID === CurrentUser._id ? 'sent-message' : 'received-message'">
                    <p :class="message.senderID === CurrentUser._id ? 'received-message-text' : 'sent-message-text'">{{ message.text }}</p> 
                    </div>
                </div>
        </div>
        <div class="message-input p-3">
                <div class="input-group">
                    <input type="text" id="textbox" class="form-control" placeholder="Type your message..." aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="SendMessage()"><img class="send-icon" src="../../assets/send-message.png" alt=""></button>
                </div>
            </div>
    </div>
</div>
</template>

<script>
import loadingSpinner from '@/components/GeneralComponents/LoadingSpinner.vue'

export default{
    name: "Messages",
    data(){
        return{
            polling: null,
            conversationID: this.$route.params.conversationid,
            loading: false,
        }
    },
    components: {
        loadingSpinner,
    },
    mounted(){
        if(this.$route.params.conversationid !== ""){
            this.$store.dispatch('getMessages', this.$route.params.conversationid)
        }
        this.$store.dispatch('getCurrentUser')
    },
    computed:{
        Conversation(){
            return this.$store.getters.Messages;      
        },
        CurrentUser(){
            return this.$store.getters.CurrentUser;
        }
    },
    methods: {
        async SendMessage(){
            let text = document.getElementById('textbox').value;
            if (text !== ""){
                await this.$store.dispatch('sendMessage', {conversationID: this.conversationID, senderID: this.CurrentUser._id, receiverID: this.$store.getters.ReceiverID, text: text});
            }
            document.getElementById('textbox').value = "";
        },
        PollMessages(){
            this.polling = setInterval(() => {
                this.$store.dispatch('getMessages', this.$route.params.conversationid);
		    }, 1000)
        },
    },
    watch:{
        async $route (){
            this.loading = true;
            this.conversationID = this.$route.params.conversationid;
            await this.$store.dispatch('getMessages', this.$route.params.conversationid);
            this.PollMessages();
            this.loading = false;
            
        }
    },
    created(){
        if(this.$route.params.conversationid !== ""){
            console.log(this.$route.params.conversationid);
            this.PollMessages();
        }
    },
    beforeDestroy() {
        clearInterval(this.polling);
    }
}
</script>

<style scoped>

.col-md{
    background-color: white;
}
.messages{
    min-height: 300px;
    max-height: 400px;
	border: 0.5px solid #e5e5e5;
    margin: auto;
    position: relative;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow-y: auto;

}

p{
    font: Roboto;
    margin: 0;
    text-justify: left;
    vertical-align: center;
    overflow-wrap: break-word;
}

.sent-message-text{
    color: #4A4A4A;
}
.received-message-text{
    color: #e5e5e5;
}

.received-message{
    margin-top: 15px;
    width: fit-content;
    padding: 10px;
    max-width: 40%;
    margin-left: 10%;
  	background-color:#d5d5d5;
    position: relative;
  	border-radius: 15px;
    border-bottom-left-radius: 0%;
}

.sent-message{
    margin-top: 15px;
    width: fit-content;
    padding: 10px;
    max-width: 40%;
  	background-color: #024796;
  	position: relative;
  	border-radius: 15px;
  	border-bottom-right-radius: 0%;
    margin-right: 10%;
    float: right;
}

.send-icon{
    height: 20px;
    width: 20px;
}
.btn:hover{
    color: transparent;
    background-color: transparent;
}
@media only screen and (max-width: 771px){
    .messages{
        margin: 0 !important;
    }
    .col-md{
        margin-left: 8%;
    }
}
</style>