<template>
  <div class="container-fluid">
    <LoadingSpinnerComponent v-if="this.selectedComponent == 'LoadingSpinnerComponent'" />
    <WelcomePageComponent @changeStep="changeStep" v-if="this.currentUser.userOnboarding && this.currentUser.userOnboarding.addressComplete === false && this.currentUser.userOnboarding.addressSkippedDuringWelcome === false && this.selectedComponent === 'WelcomePageComponent'"/>
    <AddressComponent @changeStep="changeStep" v-if="this.currentUser.userOnboarding && this.currentUser.userOnboarding.addressComplete === false && this.currentUser.userOnboarding.addressSkippedDuringWelcome === false && this.selectedComponent === 'AddressComponent'"/>
    <PayPalOnboardComponent v-if="this.currentUser.userOnboarding && (this.currentUser.userOnboarding.addressComplete === true || this.currentUser.userOnboarding.addressSkippedDuringWelcome === true) && this.currentUser.userOnboarding.paypalComplete === false && this.selectedComponent === 'PayPalOnboardComponent'"/>
  </div>
</template>

<script>
import WelcomePageComponent from "@/components/WelcomePage/WelcomePage.vue"
import AddressComponent from "@/components/WelcomePage/Address.vue"
import PayPalOnboardComponent from "@/components/WelcomePage/PayPalOnboard.vue"
import LoadingSpinnerComponent from "@/components/GeneralComponents/LoadingSpinner.vue"

export default {
  name: 'welcome',
  data(){
    return{
      selectedComponent: "LoadingSpinnerComponent"
    }
  },
  components:{
    WelcomePageComponent,
    AddressComponent,
    PayPalOnboardComponent,
    LoadingSpinnerComponent,
  },
  async created() {
    await this.$store.dispatch('getCurrentUser');
    if (this.currentUser.userOnboarding.addressComplete === false && this.currentUser.userOnboarding.addressSkippedDuringWelcome === false) {
      this.selectedComponent = "WelcomePageComponent";
    }
    if ((this.currentUser.userOnboarding.addressComplete === true || this.currentUser.userOnboarding.addressSkippedDuringWelcome === true) && this.currentUser.userOnboarding.paypalComplete === false && this.currentUser.userOnboarding.paypalSkippedDuringWelcome === false) {
      this.selectedComponent = "PayPalOnboardComponent";
    }
    if ((this.currentUser.userOnboarding.addressComplete === true || this.currentUser.userOnboarding.addressSkippedDuringWelcome === true) && (this.currentUser.userOnboarding.paypalComplete === true || this.currentUser.userOnboarding.paypalSkippedDuringWelcome === true)) {
      this.selectedComponent = "OnboardFullyComplete";
    }
  },
  mounted(){
  },
  computed:{
    currentUser() {
      return this.$store.getters.CurrentUser;
    }
  },
  methods:{
    async changeStep(componentName) {
      this.selectedComponent = 'LoadingSpinnerComponent';
      await this.$store.dispatch('getCurrentUser');
      if (this.$store.getters.CurrentUser.userOnboarding.addressComplete === true || this.$store.getters.CurrentUser.userOnboarding.addressSkippedDuringWelcome === true || componentName === 'AddressComponent') {
        this.selectedComponent = componentName;
      }
    }
  }
}
</script>

<style scoped>
body {
  background-color: #fbfbfb;
}
</style>