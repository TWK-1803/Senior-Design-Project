<template>
    <NavBar/>
    <div class="row">
        <div class="col-md-4 conversations"><Conversations/></div>
        <div class="col-md-8">
            <Messages v-if='this.routeParamExists'/>
            <EmptyMessages v-if='!this.routeParamExists'/>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/LandingPage/NavBar.vue';
import Conversations from '@/components/MessagingPage/Conversations.vue';
import Messages from '@/components/MessagingPage/Messages.vue';
import EmptyMessages from '@/components/MessagingPage/EmptyMessages.vue';

export default{
    name: "MessagingPage",
    data(){
        return{
            routeParamExists: this.$route.params.conversationid !== ""
        }
    },
    components:{
        NavBar,
        Conversations,
        Messages,
        EmptyMessages
    },
    watch:{
        async $route (){
            this.routeParamExists = this.$route.params.conversationid !== "";
        }
    }
}
</script>

<style scoped>
.row{
    display: flex;
    justify-content: center;
}
.conversations{
    overflow: auto;
    white-space: nowrap;
    justify-content: space-between;
}
@media only screen and (max-width: 420px){
    .col-md-8{
        margin-left: 4%;
    }
}
</style>