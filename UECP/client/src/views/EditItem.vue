<template>
    <div class="container-fluid">
        <NavBar/>
        <Item/>
    </div>
    </template>
    
    <script>
    import NavBar from "@/components/LandingPage/NavBar.vue"
    import Item from "@/components/UserSettings/EditItem.vue"
    
    
    
    export default {
        name: 'EditItem',
        data(){
            return{
            }
        },
        components:{
            NavBar,
            Item,
        },
        mounted(){
        },
        computed:{
        },
        methods:{
        }
    }
    </script>
    
    <style scoped>
    body {
    background-color: #fbfbfb;
    }
    </style>