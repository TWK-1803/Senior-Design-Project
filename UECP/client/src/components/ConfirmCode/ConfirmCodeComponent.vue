<template>
  <!-- {{ codeConfirmed }} -->
  <loadingSpinner v-if="isLoading"/>
  <div class="vh-100 d-flex align-items-center" v-if="!isLoading">
    <div class="container-sm">
      <div class="d-flex flex-column justify-content-centerjustify-content-center py-5">
        <h2 class="text-center" ref="resultText" v-if="codeConfirmed">Code Confirmed!</h2>
          <h2 class="text-center" ref="resultText" v-if="!codeConfirmed">Incorrect Code or URL</h2>
          <div class="d-flex justify-content-center" v-if="codeConfirmed">
            <button class="btn btn-primary" @click="this.$router.push({name: 'home'})">Go Home</button>
          </div>
      </div>
    </div>

    <!-- <div class="vh-100 d-flex align-items-center" v-if="isLoading === false">
    <div class="container-sm">
      <div class="d-flex flex-column justify-content-centerjustify-content-center py-5">
          <h2 class="text-center" ref="resultText">Incorrect Code or URL</h2>
          <div class="d-flex justify-content-center" v-if="codeConfirmed">
            <button class="btn btn-primary" @click="this.$router.push({name: 'home'})">Go Home</button>
          </div>
      </div>
    </div> -->

  </div>
</template>

<script>
import loadingSpinner from '@/components/GeneralComponents/LoadingSpinner.vue'

export default {
  name: 'ConfirmCodeComponent',
  data(){
    return{
      // isLoading: true,
      // codeConfirmed: false,
    }
  },
  components:{
    loadingSpinner
  },
  created() {
  },
  async mounted(){
    if (Object.keys(this.$route.query).length !== 0 && this.$route.query.orderID && this.$route.query.code) {
      await this.$store.dispatch('confirmPickupCode', this.$route.query);
    }
  },
  computed:{
    isLoading() {
      if (Object.keys(this.$store.getters.codeConfirm).length !== 0) {
        this.isLoading = false;
      } else if (Object.keys(this.$route.query).length === 0 || !this.$route.query.orderID || !this.$route.query.code) {
        return false;
      } else {
        return true;
      }
    },
    codeConfirmed() {
      if (Object.keys(this.$store.getters.codeConfirm).length !== 0) {
        if (this.$store.getters.codeConfirm.codeConfirm === false) {
          return false;
        } else if (this.$store.getters.codeConfirm.codeConfirm === true) {
          return true;
        }
      }
    }
  },
  methods:{
  }
}
</script>

<style scoped>

</style>