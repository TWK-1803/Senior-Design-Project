<template>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md order-confirmation p-4 mt-5">        
          <center>
            <img class="mb-2" src="../../assets/party-popper.png" alt=""><br>
            <h5 class="mb-2">Your order is complete!</h5>    
          </center>

          <span> Order ID: <label >{{ Order.orderID }}</label></span><br>
          <span> Order total: <label >${{ Order.orderDetails.totalAmount }}</label> </span><br>
          <span> Delivered to: {{ Order.orderDetails.shipToAddress.address_line_1 }}, {{ Order.orderDetails.shipToAddress.admin_area_2 }}, {{ Order.orderDetails.shipToAddress.admin_area_1 }} {{ Order.orderDetails.shipToAddress.postal_code }}</span><br>
          <h5 class="mt-4 mb-4"> Item Details </h5><br>
          <span> Item: <label> {{ Item.title }}</label> </span><br>
          <span>Description: <label > {{ Item.description }}</label></span><br>
          <span> Condition: <label >{{ Item.condition }}</label> </span><br>
    </div>
    <div class="col-md-4"></div>
  </div>
</template>
    
    <script>
    export default {
      name: 'ShippingConfirmation',
      data(){
        return{
        }
      },
      mounted(){
        this.$store.dispatch('getOrder', this.$route.params.id);
        this.$store.dispatch('getItem', this.Order.orderDetails.itemID);
      },
      computed:{
        Item(){
          return this.$store.getters.Item;
        },
        Order(){
            return this.$store.getters.Order;
        },
      },
      methods:{
        NavigateToLandingPage() {
          this.$router.push({name: 'home'});
        },
      },
        
    }
    </script>
    
    <style scoped>
      .col-md{
        display: grid;
        justify-content: center;
      }
      .order-confirmation{
        border-radius: 5px;
        width: 600px;
        background-color: white;
      }
      img{
        height: 100px;
        width: 100px;
      }h5{
        font-weight: bold;
      }
      label{
        display: inline;
      }
      span{
        margin-bottom: 2%;
      }
    </style>