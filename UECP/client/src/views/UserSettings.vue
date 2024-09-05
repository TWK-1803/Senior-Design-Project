<template>
  <NavBar/>
  <div class="row user-menu">
    <div class="col-md-12 user-menu-nav">
      <div class="phone-menu-item">
        <img src="../assets/info.png" alt=""><br>
        <span @click.prevent="openInfo()">General Information</span>
      </div>
      <div class="phone-menu-item">
        <img src="../assets/settings.png"  alt=""><br>
        <span @click.prevent="openSettings()">Social Media</span>
      </div>
      <div class="phone-menu-item">
        <img src="../assets/wallet.png"  alt=""><br>
        <span @click.prevent="openPayments()">Payments</span>
      </div>
      <div class="phone-menu-item">
        <img src="../assets/hub.png"  alt=""><br>
        <span @click.prevent="openHub()">Seller Hub</span>
      </div>
      <div class="phone-menu-item">
        <img src="../assets/box.png"  alt=""><br>
        <span @click.prevent="openBoughtOrders()">Bought Orders</span>
      </div>
      <div class="phone-menu-item">
        <img src="../assets/star.png" alt=""><br>
        <span @click.prevent="openRatings()">Ratings</span>
      </div>
    </div>
  </div>

  <div class="d-flex justify-content-between" style="height: calc(100% - 80px);">
    <div class="groupScreenMd" style="flex: 0 0 300px; position: sticky; top: 0;">
      <nav class="collapse d-lg-block sidebar bg-white" style="">
        <div class="list-group list-group-flush mt-4 mx-4">
          <a href="#" class="list-group-item list-group-item-action py-2 ripple" aria-current="true" @click.prevent="openInfo()">
            <img src="../assets/info.png" class="categ-icon" alt=""><span>General Information</span>
          </a>
          <a href="#" class="list-group-item list-group-item-action py-2 ripple " @click.prevent="openSettings()">
            <img src="../assets/settings.png" class="categ-icon" alt=""><span>Social Media</span>
          </a>
          <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="openPayments()">
            <img src="../assets/wallet.png" class="categ-icon" alt=""><span>Payments</span></a>
          <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="openHub()">
            <img src="../assets/hub.png" class="categ-icon" alt=""><span>Seller Hub</span></a>
            <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="openBoughtOrders()">
            <img src="../assets/box.png" class="categ-icon" alt=""><span>Bought Orders</span></a>
          <a href="#" class="list-group-item list-group-item-action py-2 ripple" @click.prevent="openRatings()">
            <img src="../assets/star.png" class="categ-icon" alt=""><span>Ratings</span>
          </a>
        </div>
      </nav>
    </div>
    <div class="groupScreenMd" style="width: 100%; padding: 0 50px; min-width: 0;">
      <UserInfo class="animate__animated animate__fadeIn"  v-if="show_info"/>
      <UserPayments class="animate__animated animate__fadeIn"  v-if="show_payments"/>
      <UserRatings class="animate__animated animate__fadeIn"  v-if="show_ratings"/>
      <user-settings class="animate__animated animate__fadeIn"  v-if="show_settings"/>
      <SellerHub class="seller-hub animate__animated animate__fadeIn"  v-if="show_hub" style="overflow-y: auto;"/>
      <UserBoughtOrders class="animate__animated animate__fadeIn"  v-if="show_bought_orders"/>
    </div>
    
    <div class="col groupScreenSm" style="min-width: 0;">
      <UserInfo class="animate__animated animate__fadeIn"  v-if="show_info"/>
      <UserPayments class="animate__animated animate__fadeIn"  v-if="show_payments"/>
      <UserRatings class="animate__animated animate__fadeIn"  v-if="show_ratings"/>
      <user-settings class="animate__animated animate__fadeIn"  v-if="show_settings"/>
      <SellerHub class="seller-hub animate__animated animate__fadeIn"  v-if="show_hub" style="overflow-y: auto;"/>
      <UserBoughtOrders class="animate__animated animate__fadeIn"  v-if="show_bought_orders"/>
    </div>


  </div>
</template>

<script>
import NavBar from "@/components/LandingPage/NavBar.vue"
import UserInfo from "@/components/UserSettings/UserInfo.vue"
import UserSettings from "@/components/UserSettings/UserSettings.vue"
import UserRatings from "@/components/UserSettings/UserRatings.vue"
import SellerHub from "@/components/UserSettings/UserSellerHub.vue"
import UserPayments from "@/components/UserSettings/UserPayments.vue"
import UserBoughtOrders from "@/components/UserSettings/UserBoughtOrders.vue"

export default {
  name: "UserProfile",
  components:{
    NavBar,
    UserInfo,
    SellerHub,
    UserPayments,
    UserSettings,
    UserRatings,
    UserBoughtOrders
  },
  data(){
    return{
      show_info: true,
      show_hub: false,
      show_payments: false,
      show_settings: false,
      show_ratings: false,
      show_bought_orders: false
    };
  },
  methods:{
    openInfo() {
      if(!this.show_info){ this.show_info = !this.show_info;}
      this.show_hub = false;
      this.show_payments = false;
      this.show_ratings = false;
      this.show_settings = false;
      this.show_bought_orders = false;
    },
    openSettings() {
      this.show_info = false;
      this.show_hub = false;
      this.show_payments = false;
      this.show_ratings = false;
      this.show_bought_orders = false;
      if(!this.show_settings){ this.show_settings = !this.show_settings;}
    },
    openHub(){
      this.show_info = false;
      if(!this.show_hub){ this.show_hub = !this.show_hub;}
      this.show_payments = false;
      this.show_ratings = false;
      this.show_settings = false;
      this.show_bought_orders = false;
    },
    openRatings(){
      this.show_info = false;
      this.show_hub = false;
      this.show_payments = false;
      if(!this.show_ratings){ this.show_ratings = !this.show_ratings;}
      this.show_settings = false;
      this.show_bought_orders = false;
    },
    openPayments(){
      this.show_info = false;
      this.show_hub = false;
      if(!this.show_payments){ this.show_payments = !this.show_payments;}
      this.show_ratings = false;
      this.show_settings = false;
      this.show_bought_orders = false;
    },
    openBoughtOrders() {
      this.show_info = false;
      this.show_hub = false;
      this.show_payments = false;
      this.show_ratings = false;
      this.show_settings = false;
      if(!this.show_bought_orders){ this.show_bought_orders = !this.show_bought_orders;}
    }
  }
}
</script>

<style scoped>
body {
background-color: #fbfbfb;
}
.row {
  padding: 0;
  --bs-gutter-x: 0
}
/* Sidebar */
.sidebar {
padding: 5px 0 0; /* Height of navbar */
box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
/* width: 300px; */
z-index: 600;
height: 100%;
}
.list-group-item::selection{
  color:#DD7230;
}
.sidebar .active {
border-radius: 5px;
box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
color: #DD7230;
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
a{
    margin-bottom: 5%;
}
  .user-menu{
    display: none;
  }
  .groupScreenSm {
    display: none;
    padding: 25px;
  }
  span{
    font-weight: normal;
  }
  .side-menu .col-md{
    padding: 0;
    top:0;
  }
  .list-group-item-action:focus{
    color: #DD7230;
    background-color: transparent;
  }
  .phone-menu-item img{
    height: 20px;
    width: 20px;
  }
  @media only screen and (max-width: 993px) {

    .groupScreenMd {
      display: none;
    }
    .groupScreenSm {
      display: block;
    }
    .user-menu{
      display: initial;
    }
    .user-menu{
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .user-menu-nav{
    display: flex;
    justify-content: center;
    gap: 25px;
    padding: 3%;
    border-bottom: 1px solid #dfdfdf;
    padding-bottom: 3%;
  }
  .user-menu span{
    cursor: pointer;

  }
  .user-menu span:hover{
    color: #DD7230;
  }
  .side-menu{
    display: none;
  }
  .side-menu input{
  height: 80px;
  background-color: #f9f9f9 ;
}
.col-md-8{
  width: 100%;
  margin-left: 0% !important;
}
.seller-hub{
  padding: 0;
}
  }
  @media only screen and (max-width: 527px) {
    .user-menu span{
      font-size: 2vw;
    }
  }
  .col-md-9 {
    padding: 25px;
  }
</style>