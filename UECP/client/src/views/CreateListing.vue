<template>
  <div class="container-fluid">
    <NavBar/>
    <NewListing/>
    <!-- <ErrorMessageRequirePayPalOnBoard v-if="currentUser.paymentMethods.paypal == null"/> -->
  </div>
</template>

<script>
import NavBar from "@/components/LandingPage/NavBar.vue"
import NewListing from "@/components/CreateListing/NewListing.vue"
// import ErrorMessageRequirePayPalOnBoard from "@/components/CreateListing/ErrorMessageRequirePayPalOnBoard.vue"

export default {
  name: 'CreateListing',
  data(){
    return{
    }
  },
  components:{
    NavBar,
    NewListing,
    // ErrorMessageRequirePayPalOnBoard,
  },
  created() {
    this.$store.dispatch('getCurrentUser');
  },
  computed:{
    currentUser() {
      return this.$store.getters.CurrentUser;
    }
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