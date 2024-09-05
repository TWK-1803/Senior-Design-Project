<template>  
<div class="row" style="display: flex; justify-content: center;">
    <div class="col-md-6 prod-sec mt-5 p-3 mb-5">
      <h5>Complete your purchase</h5>
      <hr style="color: rgb(168, 168, 168);">
      <img class="img-fluid rounded float-left product-image" :src=this.Item.images[0].url alt="..."/>
      <label class="mt-2">Price: <span>${{ Item.price }}</span></label>
      <label>Item: <span>{{ Item.title }}</span></label>
      <label>Seller: <span>{{ SellerInfo.username }}</span></label>
      <Label>Choose your payment method:</Label>
      <div id="smart-button-container" v-if="Item.deliveryMethod && Item.deliveryMethod['Shipping'] && currentUser.userOnboarding && currentUser.userOnboarding.addressComplete === true && currentUser.userOnboarding.paypalComplete === true">
        <div style="text-align: center;">
          <div ref="paypal"></div>
        </div>
      </div>
      <div class="d-flex " v-if="currentUser.userOnboarding && (currentUser.userOnboarding.addressComplete === false || currentUser.userOnboarding.paypalComplete === false) && Item.deliveryMethod && Item.deliveryMethod['Shipping']">
        <p class="alert alert-primary">
          Address and PayPal onboarding has to be completed in order to purchase shipping items
        </p>
      </div>
      <div class="purchaseInPerson d-flex justify-content-center" v-if="Item.deliveryMethod && Item.deliveryMethod['In-Person']">
        <input type="button" class="btn btn-primary" value="Pay In Person" @click="inPersonBuy()">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Checkout',
  data(){
    return{
      loaded: false,
      paidFor: false,
    }
  },
  async created() {

  },
  async mounted(){
    await this.$store.dispatch('getItem', this.$route.params.id);
    await this.$store.dispatch('getCurrentUser');
    if (this.Item.deliveryMethod && this.Item.deliveryMethod['Shipping'] && this.currentUser.userOnboarding && this.currentUser.userOnboarding.addressComplete === true && this.currentUser.userOnboarding.paypalComplete === true) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=sb";
      script.addEventListener("load", this.setLoaded);
      document.body.appendChild(script);
    }
  },
  computed:{
    Item(){
      return this.$store.getters.Item;
    },
    SellerInfo(){
      return this.$store.getters.SellerInfo;
    },
    currentUser() {
      return this.$store.getters.CurrentUser;
    },
    orderID() {
      return this.$store.getters.inPersonOrderID;
    },
  },
  methods:{
    async inPersonBuy() {
      await this.$store.dispatch('createInPersonOrder', this.Item._id);
      this.$router.push({name: 'confirmation', params: { id: this.orderID }});
    },
    setLoaded() {
      this.loaded = true;

      let shippingInfo = {};

      let allShippingOptions = [];
      let shippingOption = {};
      let pickupOption = {};

      if (this.Item.deliveryMethod["Shipping"]) {
        shippingOption["id"] = "Ship";
        shippingOption["label"] = this.Item.deliveryMethod["Shipping"]["Domestic Carrier Service"]["name"];
        shippingOption["type"] = "SHIPPING",
        shippingOption["selected"] = true;
        shippingOption["amount"] = {
          value: this.Item.deliveryMethod["Shipping"]["Flat Rate"],
          currency_code: "USD",
        }
      }
      if (this.Item.deliveryMethod["In-Person"]) {
        pickupOption["id"] = "PickUp";
        pickupOption["label"] = this.Item.deliveryMethod["In-Person"];
        pickupOption["type"] = "PICKUP";
        pickupOption["selected"] = true;
      }
      if (!jQuery.isEmptyObject(shippingOption)) {
        allShippingOptions.push(shippingOption);
      }
      if (!jQuery.isEmptyObject(pickupOption)) {
        allShippingOptions.push(pickupOption);
      }

      if (pickupOption.id) {
        shippingInfo = {
          name: {
            full_name: "S2S pickup"
          },
          address: {
            "address_line_1":"201 Mayfield Ave",
            "address_line_2":"",
            "admin_area_2":"Ruston",
            "admin_area_1":"LA",
            "postal_code":"71272",
            "country_code":"US"
          },
          options: allShippingOptions
        }
      } else {
        shippingInfo = {
          options: allShippingOptions
        }
      }

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                name: this.Item.title,
                description: this.Item.description,
                amount: {
                  value: this.Item.price + this.Item.deliveryMethod["Shipping"]["Flat Rate"],
                  currency_code: "USD",
                  breakdown: {
                    item_total: {
                      value: this.Item.price,
                      currency_code: "USD"
                    },
                    shipping:{
                      value: this.Item.deliveryMethod["Shipping"]["Flat Rate"],
                      currency_code: "USD"
                    } 
                  }
                },
                payee: {
                  email_address: this.SellerInfo.paymentMethods.paypal,
                },
                payer: {
                  email_address: this.currentUser.paymentMethods.paypal,
                },
                shipping: shippingInfo
              }
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((orderData) => {
            // Full available details
           // console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

            // comment below is to error check the if-else statement
            // orderData.status = "yo";
            if (orderData.status == "COMPLETED") {
              this.$store.dispatch('createShippingOrder', { order: orderData, id: this.Item._id });
              this.$router.push({name: 'confirmation', params: {id: orderData.id}});
            }
            else {
              console.log("!! THIS ORDER SHOULD NOT GO THROUGH !!")
            }
          })
        },
        style: {
          layout: 'horizontal',
          shape: 'rect',
          label: 'paypal'
        }
      }).render(this.$refs.paypal);
    },
  },
}
</script>

<style scoped>

label {
  margin-bottom: 10px;
  display: block;
}

span.price {
  float: right;
  color: grey;
}

.prod-sec{
  background-color: white;
  border-radius: 10px;
}
.prod-sec img{
  border: 0.5px solid #e5e5e5;
  width: 150px;
  height: 150px;
}
.prod-sec label{
  font-weight: bold;
}
.prod-sec span{
  font-weight: initial;
}
@media only screen and (max-width: 767px) {
  .row{
    padding: 10%;
    padding-top: 0;
  }
}
.product-image {
  object-fit: cover;
}
</style>