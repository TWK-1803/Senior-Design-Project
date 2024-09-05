<template>
  <div class="vh-100 d-flex align-items-center">
    <div class="container-sm">
      <div class="d-flex flex-column justify-content-centerjustify-content-center py-5">
          <h1 class="text-center animate__animated animate__fadeIn">Welcome to U-Market!</h1>
          <h2 class="text-center animate__animated animate__fadeIn animate__delay-1s">An e-commerce platform for university students made by students.</h2>
          <br>
          <p class="text-center animate__animated animate__fadeIn animate__delay-2s">In order to utilize shipping orders, we have to onboard you through PayPal.</p>
          <p class="text-center animate__animated animate__fadeIn animate__delay-3s">We will ask for your address and then have you proceed with onboarding process through PayPal.</p>
          <p class="text-center animate__animated animate__fadeIn animate__delay-4s">You can always onboard at a later time, but you will not be able to create or purchase shipping items until onboarded.</p>
          <div class="footer d-flex justify-content-center animate__animated animate__fadeIn animate__delay-5s">
            <button class="btn btn-primary ms-1" @click.stop="changeStep()">Continue<img src="@/assets/arrow-right-s-line.png"></button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePageComponent',
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
    async changeStep() {
      this.$emit('changeStep', 'AddressComponent');
    }
  }
}
</script>

<style scoped>
.animate__animated.animate__fadeIn {
  --animate-duration: 3s;
}
.row {
  margin: 0;
}
.container-sm {
  border: none;
  background-color: transparent;
  border-radius: 25px;
}
h1 {
  font-size: 5rem;
}
</style>