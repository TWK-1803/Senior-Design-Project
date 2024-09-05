<template>
    <div class="row">
        <div class="col-md col-md mt-3 mb-3" v-for="item in getAllItems" :key = "item._id">
            <div class="card" @click="NavigateToListing(item._id)" style="width: 18rem;">
                <img :src = item.images[0].url  class="card-img-top" alt="...">
                <div class="card-body">
                    <span>{{ item.typeOfDeal }}</span>
                    <p class="card-text">{{ item.description }}</p>
                    <label>{{ item.condition }}</label><br>
                    <span >$ {{ thousands_separators(item.price) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "SellerHub",
    data() {
        return {

        }
    },
    mounted(){
        this.$store.dispatch('getProducts')
    },
    computed:{
        getAllItems(){
            return this.$store.getters.AllItems.filter(item => item.sellerID === this.$route.params.id);
        }
    },
    methods:{
    thousands_separators(num){
        if (num == null){
            num = 0
        }
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    },
    NavigateToListing(id){
        this.$router.push({name: 'listing', params: {id: id}});
    }
    } 
}
</script>

<style scoped>
    .col-md img{
        height: 200px;
        width: 100%;
    }
    .card-img-top{
        padding-top: 2%;
        object-fit: cover;
    }
    span{
        font-size: 13px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .col-md{
            display: flex;
            justify-content: center;
        }
    @media only screen and (max-width: 993px) {
        h1{
            margin-left: 5%;
        }
    }
    @media only screen and (min-width:768px) and (max-width: 1260px ){
        .col-md{
            justify-content: left;
            margin-left: 5%;
        }
    }
</style>