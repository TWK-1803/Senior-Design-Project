<template>
    <div class="container-fluid">
        <NavBar/>
        <ShippingConfirmation v-if="Order.orderType == 'Shipping'"/>
        <InPersonConfirmation v-if="Order.orderType == 'Pickup'"/>
    </div>
    </template>
    
    <script>
    import NavBar from "@/components/LandingPage/NavBar.vue"
    import ShippingConfirmation from "@/components/CheckoutConfirmation/ShippingConfirmation.vue"
    import InPersonConfirmation from "@/components/CheckoutConfirmation/InPersonConfirmation.vue"

    export default {
        name: 'CheckoutConfirmation',
        data(){
            return{
            }
        },
        components:{
            NavBar,
            ShippingConfirmation,
            InPersonConfirmation
        },
        async created() {
            await this.$store.dispatch('getOrder', this.$route.params.id);
            await this.$store.dispatch('getItem', this.Order.orderDetails.itemID);
        },
        mounted(){
        },
        computed:{
            Item() {
                return this.$store.getters.Item;
            },
            Order() {
                return this.$store.getters.Order;
            },
        },
        methods:{
        },
    }
    </script>
    
    <style scoped>
    body {
    background-color: #fbfbfb;
    }
    </style>