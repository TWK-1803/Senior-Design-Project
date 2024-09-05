<template>
<div class="container-fluid">
  <NavBar/>
  <div class="row">
    <div class="col-auto hide-on-xs">
      <div class="side-menu row">
        <div class="col-md">
          <nav class="collapse d-lg-block sidebar collapse bg-white">
            <div class="list-group list-group-flush mx-3 mt-3">
              <div class="input-group mb-3">
                <div class="input-group-text">
                  <img src="../assets/glass.png" class="search-icon"/>
                </div>
                <input type="text" class="form-control" placeholder="Search U-Market" aria-label="Username" aria-describedby="basic-addon1" v-model="search">
              </div>
              <button type="button" class="btn btn-primary btn-new-prod mb-3" @click="$router.push('/createListing')">
                <i class="fa fa-plus icn-plus"></i>New Product
              </button>
              <!-- filters -->
              <FilterHomeGoods v-if="this.categories[0].isVisible"/>
              <FilterSports v-if="this.categories[1].isVisible"/>
              <FilterVehicles v-if="this.categories[2].isVisible"/>
              <FilterElectronics v-if="this.categories[3].isVisible"/>
              <FilterPetSupplies v-if="this.categories[4].isVisible"/>
              <FilterEntertainment v-if="this.categories[5].isVisible"/>
              <FilterClothing v-if="this.categories[6].isVisible"/>
              <FilterMusicalInstruments v-if="this.categories[7].isVisible"/>
              <!-- categories -->
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" aria-current="true" @click.prevent="changeVisibility('Home Goods')">
                <img src="../assets/house.png" class="categ-icon" alt=""><span>Home Goods</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Sports')">
                <img src="../assets/sports.png" class="categ-icon" alt=""><span>Sports</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Vehicles')">
                <img src="../assets/car.png" class="categ-icon" alt=""><span>Vehicles</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Electronics')">
                <img src="../assets/smartphone.png" class="categ-icon" alt=""><span>Electronics</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Pet Supplies')">
                <img src="../assets/pets.png" class="categ-icon" alt=""><span>Pet Supplies</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Entertainment')">
                <img src="../assets/gamepad.png" class="categ-icon" alt=""><span>Entertainment</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Clothing')">
                <img src="../assets/clothes.png" class="categ-icon" alt=""><span>Clothing</span>
              </a>
              <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="changeVisibility('Musical Instruments')">
                <img src="../assets/guitar.png" class="categ-icon" alt=""><span>Musical Instruments</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <div class=" row categories">
        <div class="col-md-8 categories-col">
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Home Goods')">
                <img src="../assets/house.png" alt=""><span class="mb-3">Home Goods</span>
              </a>
            </div>
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Sports')">
                <img src="../assets/sports.png"  alt=""><span class="mb-3">Sports</span>
              </a>
            </div>
            <div class="item" @click.prevent="changeVisibility('Vehicles')">
              <a href="">
                <img src="../assets/car.png"  alt=""><span class="mb-3">Vehicles</span>
              </a>
            </div>
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Electronics')">
                <img src="../assets/smartphone.png"  alt=""><span class="mb-3">Electronics</span>
              </a>
            </div>
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Pet Supplies')">
                <img src="../assets/pets.png"  alt=""><span class="mb-3">Pets Supplies</span>
              </a>
            </div>
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Entertainment')">
                <img src="../assets/gamepad.png" alt=""><span class="mb-3">Entertainment</span>
              </a>
            </div>
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Clothing')">
                <img src="../assets/clothes.png"  alt=""><span class="mb-3">Clothing</span>
              </a>
            </div>
            <div class="item">
              <a href="" @click.prevent="changeVisibility('Musical Instruments')">
                <img src="../assets/guitar.png"  alt=""><span class="mb-3">Musical Instruments</span>
              </a>
            </div>
        </div>
    </div>


    <div class="col-md mb-5">
      <ProductListing :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.listing"/>
      <HomeGoods :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[0].isVisible"/>
      <Sports :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[1].isVisible"/>
      <Vehicles :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[2].isVisible"/>
      <Electronics :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[3].isVisible"/>
      <PetSupplies :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[4].isVisible"/>
      <Entertainment :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[5].isVisible"/>
      <Clothing :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[6].isVisible"/>
      <MusicalInstruments :search="this.search" class="animate__animated animate__fadeInDown" v-if="this.categories[7].isVisible"/>
    </div>
  </div>
</div>
</template>

<script>
import NavBar from "@/components/LandingPage/NavBar.vue"
import ProductListing from "@/components/LandingPage/ProductListing.vue"
import HomeGoods from "@/components/LandingPage/Categories/HomeGoods.vue"
import Sports from "@/components/LandingPage/Categories/Sports.vue"
import Vehicles from "@/components/LandingPage/Categories/Vehicles.vue"
import Electronics from "@/components/LandingPage/Categories/Electronics.vue"
import PetSupplies from "@/components/LandingPage/Categories/PetSupplies.vue"
import Entertainment from "@/components/LandingPage/Categories/Entertainment.vue"
import Clothing from "@/components/LandingPage/Categories/Clothing.vue"
import MusicalInstruments from "@/components/LandingPage/Categories/MusicalInstruments.vue"

import FilterHomeGoods from "@/components/LandingPage/Filtering/HomeGoodsFiltering.vue"
import FilterSports from "@/components/LandingPage/Filtering/SportsFiltering.vue"
import FilterVehicles from "@/components/LandingPage/Filtering/VehiclesFiltering.vue"
import FilterElectronics from "@/components/LandingPage/Filtering/ElectronicsFiltering.vue"
import FilterPetSupplies from "@/components/LandingPage/Filtering/PetSuppliesFiltering.vue"
import FilterEntertainment from "@/components/LandingPage/Filtering/EntertainmentFiltering.vue"
import FilterClothing from "@/components/LandingPage/Filtering/ClothingFiltering.vue"
import FilterMusicalInstruments from "@/components/LandingPage/Filtering/MusicalInstrumentsFiltering.vue"



export default {
  name: 'LandingPage',
  data(){
    return{
      listing: true,
      categories : [
        {name: "Home Goods", isVisible: false},
        {name: "Sports", isVisible: false},
        {name: "Vehicles", isVisible: false},
        {name: "Electronics", isVisible: false},
        {name: "Pet Supplies", isVisible: false},
        {name: "Entertainment", isVisible: false},
        {name: "Clothing", isVisible: false},
        {name: "Musical Instruments", isVisible: false},
      ],
      search: '',
    }
  },
  components:{
    NavBar,
    ProductListing,
    Clothing,
    Sports,
    PetSupplies,
    Entertainment,
    HomeGoods,
    Vehicles,
    MusicalInstruments,
    Electronics,
    FilterHomeGoods,
    FilterSports,
    FilterVehicles,
    FilterElectronics,
    FilterPetSupplies,
    FilterEntertainment,
    FilterClothing,
    FilterMusicalInstruments,
  },
  mounted(){
    // this.$store.dispatch('getCategories'),
    // this.$store.dispatch('getTypeOfDeals'),
    // this.$store.dispatch('getItemConditions'),
    this.$store.dispatch('getItemTypes'),
    this.changeVisibility(this.$route.query.category)
    // this.$store.dispatch('getDeliveryMethods')
  },
  computed:{
    // Categories(){
    //   return this.$store.getters.AllCategories;
    // },
    // TypeOfDeals(){
    //   return this.$store.getters.AllTypeOfDeals;
    // },
    // ItemConditions(){
    //   return this.$store.getters.AllConditions;
    // },
    ItemTypes(){
      return this.$store.getters.AllTypes;
    },
    // DeliveryMethods(){
    //   return this.$store.getters.AllDeliveryMethods;
    // }
  },
  methods:{
    changeVisibility(categoryName){
      for(const i in this.categories){
        if(this.categories[i].name != categoryName){
          this.categories[i].isVisible = false 
        }
        if (this.categories[i].name == categoryName && this.categories[i].isVisible == false){
          this.listing = false 
          this.categories[i].isVisible = !this.categories[i].isVisible
          this.$router.push({ query: Object.assign({...this.$route.query}, { "category": categoryName }) });
        }
      }
    },
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
    onSubmit(){
      this.$notify({
        type: 'success',
        text: "Item Created!",
      });
    },
  }
}
</script>

<style scoped>.categories{
    display: none;
    height: 150px;
}
body {
background-color: #fbfbfb;
}
.btn-new-prod{
    background-color: #DD7230;
    border: transparent;
    height: 45px;
}
.btn-new-prod:hover{
    background-color: #c8540b;
}
/* Sidebar */
.sidebar {
padding: 5px 0 0; /* Height of navbar */
box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
width: 320px;
height: 1700px;
}

.sidebar .active {
border-radius: 5px;
box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}
.categ-icon{
    height: 25px;
    width: 25px;
}
.sidebar span{
    margin-left: 10px;
    position: absolute;
    margin-top: 3px;
}
.icn-plus{
    margin-right: 10px;
}
.categories-col{
    display: flex;
    justify-content: space-around;
    text-align: center;
}
.categories-col img{
    margin: 15px;
}
.categories-col a span
{
    display: block;
}
.item a{
    text-decoration: none;
    color: #4A4A4A;
    display: inline-block;
}
.item span{
  font-weight: lighter;
}
.categories img{
    height: 80px;
    width: 80px;
}
.list-group-item span{
  font-weight:  normal !important;
}
@media only screen and (max-width: 1047px) {
  .hide-on-xs{
    display: none;
  }
  .categories{
    display: initial;
  }
  .categories-col{
    overflow: auto;
    white-space: nowrap;
    justify-content: space-between;
  }
  .categories-col a{
      text-decoration: none;
      display: inline-block;
  }.categories-col img{
    height: 30px;
    width:30px;
  }
.item a{
    font-weight: lighter;
}
.item:not(:last-child){
    margin-right: 15px;
}
.item{
margin-left: 10px;
}
.col-md{
  display: flex;
  justify-content: center;
}
}
@media only screen and (min-width: 775px){
  .col-md-8{
    width: 100%;
  }
}

.input-group-text, input{
  background-color: #f9f9f9 ;
}

</style>