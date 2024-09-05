<template>
    <NavBar/>
    <div class="row" style="background-color: #ffff;">
        <div class="col-md-12 seller-info mt-5 mb-3">
            <img :src="SellerInfo.profilePicture" class="rounded-circle profile-pic" alt="..." v-if="SellerInfo && SellerInfo.profilePicture.split('/').slice(-1)[0] !== 'undefined'">
        </div>
        <div class="col-md-12 seller-info" v-if="SellerInfo && SellerInfo.username">
            <span class="mt-1" style="font-weight: bold;">{{ SellerInfo.username }}</span>
            <div class="mx-3" v-if="SellerInfo && SellerInfo.averageRatings">
                <span class="fa fa-star checked" v-for="n in (SellerInfo.averageRatings)" :key="SellerInfo.averageRatings"></span>                    
                <span class="fa fa-star" v-for="n in 5 - SellerInfo.averageRatings"></span>
            </div>
        </div>
        <hr class="mt-3">
        <div class="col-md-12">
            <ul>
                <li> <a :class="{active: this.menu[0].isVisible}" href="#" @click.prevent="changeVisibility('listings')">Listings</a></li>
                <li ><a :class="{active: this.menu[1].isVisible}" href="#" @click.prevent="changeVisibility('ratings')">Ratings</a></li>
            </ul>
        </div>
    </div>
    <div class="row">
        <div class="col-md">
            <SellerHub v-if="this.menu[0].isVisible"/>
            <Ratings v-if="this.menu[1].isVisible"/>
        </div>
    </div>
</template>

<script>
import NavBar from "@/components/LandingPage/NavBar.vue"
import SellerHub from "./SellerHub.vue"
import Ratings from "./Ratings.vue"
export default {
    data(){
        return{
            menu: [
                {name: "listings", isVisible: true},
                {name: "ratings", isVisible: false}
            ],
        };
    },
    mounted(){
        this.$store.dispatch('getSellerInfo', this.$route.params.id)
    },
    components:{
        NavBar,
        SellerHub,
        Ratings
    },
    computed:{
         SellerInfo(){
            return this.$store.getters.SellerInfo;
         },
         SellerInfo(){
            if (this.$store.getters.SellerInfo && this.$store.getters.SellerInfo.ratings) {
                if (Object.keys(this.$store.getters.SellerInfo).length !== 0){
                    if(Object.keys(this.$store.getters.SellerInfo.ratings).length !== 0){
                        let sumratings = 0;
                        let numratings = 0;
                        this.$store.getters.SellerInfo.ratings.forEach(element => {
                            sumratings += element.stars;
                            numratings += 1;
                        });
                        return {"username": this.$store.getters.SellerInfo.username, "numRatings": numratings, "averageRatings": Math.floor(sumratings/numratings), "profilePicture": this.$store.getters.SellerInfo.profilePicture};
                    }
                    else{
                        return {"username":this.$store.getters.SellerInfo.username, "numRatings":0, "averageRatings": 0, "profilePicture": this.$store.getters.SellerInfo.profilePicture};
                    }
                }
                else{
                    return {"numRatings":0, "averageRatings": 0};
                }
            }
        },
    },
    methods:{
        changeVisibility(menuItem){
      for(const i in this.menu){
        if(this.menu[i].name != menuItem){
          this.menu[i].isVisible = false 
        }
        if (this.menu[i].name == menuItem && this.menu[i].isVisible == false){
          this.menu[i].isVisible = !this.menu[i].isVisible 
        }
    }
    },
    itemStyle(){
        this.isActive = !this.isActive;
        this.nonActive = !this.nonActive
    }
    }

}
</script>

<style scoped>
    .profile-pic{
        height: 150px;
        width: 150px;
        object-fit: cover;
    }
    .seller-info{
        display: flex;
        justify-content: center;
    }
    span{
        font-size: 13px;
        font-weight: bold;
        text-transform: uppercase;
    }
    ul{
        gap: 15px;
        display: flex;
        background-color:white ;
        height: 60px;
        padding: 1%;
        font-size: 18px;
        border-radius: 5px;
    }
    ul li{
        display: inline-block;
    }
    ul li:hover{
        color: #DD7230;
        cursor: pointer;
    }
    .active{
        color: #DD7230;
    }
    a{
        text-decoration: none;
        color: inherit;
    }
    .row{
        margin:0
    }
    .checked {
    color: rgb(255, 190, 0);
  }
</style>