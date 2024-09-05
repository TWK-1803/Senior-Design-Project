<template>
  <div class="row nav-bar lg-screen">
    <div class="col-md-4">
     <a href="/"> <h1>U-MARKET</h1></a>
    </div>
    <div class="col-md-4">
      <!-- <div class="input-group mb-3">
        <div class="input-group-text">
          <img src="../../assets/glass.png" class="search-icon"/>
        </div>
        <input type="text" class="form-control" placeholder="What are you looking for?" aria-label="Username" aria-describedby="basic-addon1">
      </div> -->
    </div>
    <div class="col-md-4 user-profile">
      <img :src="currentUser.profilePicture" class="rounded-circle profile-pic" alt="..." v-if="currentUser.profilePicture.split('/').slice(-1)[0] !== 'undefined'">
      <div class="dropdown">
        <span>{{ currentUser.username }}</span>
        <div class="dropdown-content">
          <a :href="'/profile/'+ currentUser._id"><img src="../../assets/website.png" alt=""/>
            Profile</a>
          <a :href="'/messaging/'"><img src="../../assets/message.png" alt=""/>
            Messages</a>
          <a href="/settings"><img src="../../assets/settings1.png" alt=""/>
            Settings</a>
          <a href="/api/logout"><img src="../../assets/logout.png" alt=""/>
            Sign Out</a>
        </div>
      </div>
    </div>
  </div>
  <div class="phone-nav nav-bar">
    <hamburger-menu/>
  </div>
</template>

<script>
import HamburgerMenu from "@/components/LandingPage/HamburgerMenu.vue"
export default {
  name: 'NavBar',
  data(){
    return{
    }
  },
  components:{
    HamburgerMenu
  },
  mounted() {
    this.$store.dispatch('getCurrentUser')
  },
  computed: {
    currentUser() {
      return this.$store.getters.CurrentUser;
    }
  },
  methods:{
    NavigateToProfile(id){
        this.$router.push({name: 'profile', params: {id: id}});
  }
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
}
.row{
  margin: 0;
  padding: 0;
}
.nav-bar{
  border-bottom: 1px solid #e5e5e5;
  height: 80px;
  background-color: #ffff;
  position: sticky;
  top: 0;
  z-index: 50
}
.col-md-4{
  padding: 12px;
}
.input-group input{
  height: 50px;
  background-color: #f9f9f9 ;

}
.input-group-text{
  background-color: #f9f9f9 !important;
}
.profile-pic{
  height: 60px;
  width: 60px;
  border: 1px solid #e5e5e5;
  object-fit: cover;
}
.nav-bar h1{
  font-weight: bold;
  color: #024796;
}
span{
  margin-left: 10px;
  cursor: pointer;
}
.user-profile{
  text-align: center;
}
@media (min-width: 765px) {
    .phone-nav{
      display: none;
    }
}
@media (max-width: 765px) {
  .lg-screen{
    display: none;
  }
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #ffffff;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  float: left;
  font-weight: lighter;
}
.dropdown-content a img{
  height: 15px;
  widows: 15px;
}
.dropdown-content span {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  float: left;
  font-weight: lighter;
  margin-left: 0;
  cursor: pointer;
}
.dropdown-content span img{
  height: 15px;
  widows: 15px;
}
.dropdown-content a:hover {
  color:#024796;
  font-weight: 300;
}
.dropdown-content span:hover {
  color:#024796;
  font-weight: 300;
}
.dropdown:hover .dropdown-content {display: block;}
.dropdown:hover .dropbtn {background-color: #3e8e41;}
</style>