<template>
  <div class="container-fluid">
    <div class="row justify-content-center mt-5">
      <span class="d-flex justify-content-center">
        PayPal onboarding is required to list an item for sale
      </span>
      <span class="d-flex justify-content-center">
        Please complete PayPal onboarding in Profile > settings > Payment Methods
      </span>
    </div>
  </div>
</template>

<script>


export default {
  name: 'ErrorMessageRequirePayPalOnBoard',
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
  }
}
</script>

<style scoped>
.row {
  margin: 0;
}
</style>