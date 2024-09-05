<template>
    <div class="container-fluid">
        <NavBar/>
        <Checkout/>
    </div>
    </template>
    
    <script>
    import NavBar from "@/components/LandingPage/NavBar.vue"
    import Checkout from "@/components/ItemCheckout/Checkout.vue"
    
    
    
    export default {
        name: 'ItemCheckout',
        data(){
            return{
            }
        },
        components:{
            NavBar,
            Checkout,
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