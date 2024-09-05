<template>
  <loadingSpinner v-if="itemLoaded === false"/>
  <div class="row" v-if="itemLoaded === true">
    <div class="col-md-3 mt-3 mb-3" v-for="item in getAllItems" :key = "item._id">
      <div class="card" style="width: 18rem;">
        <img @click="NavigateToListing(item._id)" :src = item.images[0].url  class="card-img-top" alt="...">
        <div class="card-body">
          <span>{{ item.title }}</span><br>
          <span>{{ item.typeOfDeal }}</span>
          <p class="card-text descrip">{{ item.description }}</p>
          <span>{{ item.condition }}</span><br>
          <span >$ {{ thousands_separators(item.price) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loadingSpinner from '@/components/GeneralComponents/LoadingSpinner.vue'

export default {
  name: "entertainment",
  props: ["search"],
  data(){
    return{
      itemLoaded: false,
    }   
  },
  components: {
    loadingSpinner,
  },
  async mounted(){
    if (this.$store.getters.AllItems.length === 0) {
      await this.$store.dispatch('getProducts', this.$route.query);
      this.itemLoaded = true;
    }
    this.$watch( () => this.$route.query, async () => {
      this.itemLoaded = false;
      await this.$store.dispatch('getProducts', this.$route.query);
      this.itemLoaded = true;
    });
  },
  computed:{
    getAllItems(){
      return this.$store.getters.AllItems.filter(item => item.title.toLowerCase().includes(this.search.toLowerCase()));
    },
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
  .col-md-3{
      display: flex;
      justify-content: center;
  }
  .col-md-3 img{
      height: 200px;
      width: 100%;
  }
  .card-img-top{
      padding: 2%;
      object-fit: cover;
  }
  .col-md-4{
  margin-top: 4%;
  }
  span{
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
  }
</style>