<template>
<div class="container-fluid">
    <NavBar/>
    <Item/>
</div>
</template>

<script>
import NavBar from "@/components/LandingPage/NavBar.vue"
import Item from "@/components/ItemListing/Item.vue"



export default {
    name: 'ItemListing',
    data(){
        return{
        }
    },
    components:{
        NavBar,
        Item,
    },
}
</script>

<style scoped>
body {
background-color: #fbfbfb;
}
</style>