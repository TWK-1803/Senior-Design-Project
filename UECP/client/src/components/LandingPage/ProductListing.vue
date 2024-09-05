<template>
    <div class="row item-row" style="">
        <div class="col-md mt-3 mb-3" v-for="item in getAllItems" :key = "item._id">
            <div class="card" style="width: 18rem;">
            <img @click="NavigateToListing(item._id)" :src = item.images[0].url  class="card-img-top" alt="...">
            <div class="card-body">
                <span>{{ item.title }}</span><br>
                <span class="bold-text">{{ item.typeOfDeal }}</span>
                <p class="card-text descrip">{{ item.description }}</p>
                <span>{{ item.condition }}</span><br>
                <span class="bold-text">$ {{ thousands_separators(item.price) }}</span>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "productListing",
    props: ["search"],
    data(){
        return{
            price: 0
        }   
    },
    mounted(){
        this.$store.dispatch('getProducts', this.$route.query)
    },
    computed:{
        getAllItems(){
            return this.$store.getters.AllItems.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()));
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
        padding: 2%;
        object-fit: cover;
    }
    .col-md{
        display: flex;
        justify-content: center;
    }
    .bold-text{
        font-weight: bold;
    }
    @media only screen and (max-width: 600px) {
        .col-md img{
        height: 150px;
        width: 100%;
    } 
    
    .col-md{
        display: flex;
        justify-content: center;
    }
}
</style>