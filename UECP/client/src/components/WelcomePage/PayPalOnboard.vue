<template>
  <div class="vh-100 d-flex align-items-center">
    <div class="container-sm">
      <div class="d-flex flex-column justify-content-centerjustify-content-center py-5">
          <h2 class="text-center">PayPal Onboarding</h2>
          <form action="/api/paypalOnboard" method="POST" class="d-flex justify-content-center">
            <button class="btn btn-light me-1" @click.prevent="skipToNextStep()">Skip</button>
            <button class="btn btn-primary submit">PayPal Onboard</button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayPalOnboard',
  data(){
    return{
    }
  },
  components:{

  },
  mounted(){
  },
  computed:{
  },
  methods:{
    async skipToNextStep() {
      await this.$store.dispatch('skipCurUserPayPalOnboarding');
      this.$router.push({name: "home"});
    }
  }
}
</script>

<style scoped>
.row {
  margin: 0;
}
.container-sm {
  border: none;
  background-color: white;
  border-radius: 25px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>