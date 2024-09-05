<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="header">
          <h2>Complete your listing</h2>
        </div>
        <form action="/api/createItem" method="POST" enctype="multipart/form-data">
            <div class="mb-3">
              <div class="mb-3">
                <label  class="form-label">Upload images</label>
                <input name="image" class="form-control" type="file" ref="file" accept="image/*" multiple required>
              </div>
              <label  class="form-label">Title</label>
              <input name="title" type="text" class="form-control" placeholder="E.g. Preowned Iphone 7" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <input name="description" class="form-control" id="exampleFormControlTextarea1" placeholder="Describe your item" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Item Condition</label>
              <div class="form-check form-switch" v-for="condition in conditions" :key="condition">
                <input class="form-check-input" :value="condition" name="condition" type="radio" :id="condition" required>
                <label class="form-check-label" name="condition" :for="condition">{{ condition }}</label>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Delivery Method</label>
            <div class="form-check form-switch" v-for="deliveryMethod in deliveryMethods" :key="deliveryMethod">
              <div v-if="deliveryMethod === 'Shipping' && currentUser.userOnboarding && currentUser.userOnboarding.addressComplete === true && currentUser.userOnboarding.paypalComplete === true">
                <input class="form-check-input" :value="deliveryMethod" name="deliveryMethod" type="radio" id="flexSwitchCheckShipping" required @click="setSelectedDeliveryMethod(deliveryMethod)">
                <label class="form-check-label" name="deliveryMethod"  for="flexSwitchCheckShipping">{{ deliveryMethod }}</label>
              </div>
              <div v-if="deliveryMethod === 'Shipping' && currentUser.userOnboarding && currentUser.userOnboarding.addressComplete === false && currentUser.userOnboarding.paypalComplete === false">
                <input class="form-check-input" :value="deliveryMethod" name="deliveryMethod" type="radio" id="flexSwitchCheckShipping" required @click="setSelectedDeliveryMethod(deliveryMethod)" disabled>
                <label class="form-check-label" name="deliveryMethod"  for="flexSwitchCheckShipping">{{ deliveryMethod }}</label>
              </div>
              <div v-if="deliveryMethod === 'In-Person'">
                <input class="form-check-input" :value="deliveryMethod" name="deliveryMethod" type="radio" id="flexSwitchCheckPickup" required @click="setSelectedDeliveryMethod(deliveryMethod)">
                <label class="form-check-label" name="deliveryMethod"  for="flexSwitchCheckPickup">{{ deliveryMethod }}</label>
              </div>
            </div>
          </div>

          <label class="mt-2 mb-3 form-label">Categories</label>
          <select class="mb-3 btn btn-secondary btn-drop" id="category" name="category" required :onchange="setSelectedCategory">
            <option disabled value="" selected>Please select one</option>
            <option v-for="category in categories" :key="category">{{ category }}</option>
          </select>

          <label class="mt-2 mb-1 form-label" v-if="selectedCategory !== ''">Filters</label>
          <div class="filters mx-4" v-if="selectedCategory !== ''" v-for="filter, key in filters[selectedCategory]">
            <label class="mt-2 mb-1 form-label">{{ key }}</label>
            <input class="form-control" v-if="filter == 'input'" :name="key" :placeholder="key">
            <select class="mb-1 btn btn-secondary btn-drop" :name="key" v-if="filter !== 'input'">
              <option v-for="specificFilter in filter" :key="specificFilter">{{ specificFilter }}</option>
            </select>
          </div>

          <label class="form-label mt-3">Price</label>
          <input name="price" type="text" class="form-control" placeholder="$123" required @keypress="isNumber($event)">
          <label class="mt-3 mb-3 form-label">Type Of Deal</label>
          <select class=" mb-3 btn btn-secondary btn-drop" name="typeOfDeal" required>
            <option disabled value="" selected>Please select one</option>
            <option v-for="deal in typeOfDeals" :key="deal">{{ deal }}</option>
          </select>

          <div class="shipping" v-if="this.selectedDeliveryMethod == 'Shipping'">
            <h4 class="mt-4">Shipping</h4>
            <hr>
            <div class="mb-3">
              <label class="form-label mt-3">Package Weight</label>
              <div class="d-flex align-items-center">
                <input name="packageWeight" class="form-control me-1" id="exampleFormControlTextarea1" placeholder="lbs." required @keypress="isNumber($event)">
                <input name="packageWeight" class="form-control ms-1" id="exampleFormControlTextarea1" placeholder="oz." required @keypress="isNumber($event)">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label mt-3">Package Dimensions</label>
              <div class="d-flex align-items-center">
                <input name="packageDimensions" class="form-control me-1" id="exampleFormControlTextarea1" placeholder="Length (in.)" required @keypress="isNumber($event)">
                <span>&times;</span>
                <input name="packageDimensions" class="form-control mx-1" id="exampleFormControlTextarea1" placeholder="Width (in.)" required @keypress="isNumber($event)">
                <span>&times;</span>
                <input name="packageDimensions" class="form-control ms-1" id="exampleFormControlTextarea1" placeholder="Height (in.)" required @keypress="isNumber($event)">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label mt-3">Domestic Shipping Service</label>
              <select class="mb-1 btn btn-secondary btn-drop" name="domesticShippingCarrierService" required>
                <option disabled value="" selected>Please select one</option>
                <optgroup v-for="value, key in ShippingCarrierServices" :label="key" :key="key">
                  <option v-for="value, key in ShippingCarrierServices[key]" required :value="JSON.stringify(value)">{{ value.name }}</option>
                </optgroup>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label mt-3">Cost Type</label>
              <select class="btn btn-secondary btn-drop" name="costType" id="costType" required :onchange="setSelectedCostType">
                <option disabled value="" selected>Please select one</option>
                <option v-for="costType in costTypes" :key="costType">{{ costType }}</option>
                <option disabled>Calculated (will be available in the future)</option>
              </select>
            </div>
            <div class="mb-3" v-if="this.selectedCostType == 'Flat Rate'">
              <label class="form-label mt-3">Flat Rate Shipping Cost</label>
              <input name="flatRateShippingCost" class="form-control" id="exampleFormControlTextarea1" placeholder="$123" required @keypress="isNumber($event)">
            </div>
          </div>
          <div class="footer mb-5">
            <input type="submit" class="btn btn-primary" value="Create">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewListing',
  data(){
    return{
      conditions: ["New", "Like New", "Used"],
      categories: ["Home Goods", "Sports", "Vehicles", "Electronics", "Pet Supplies", "Entertainment", "Clothing", "Musical Instruments"],
      typeOfDeals: ["Sell", "Exchange", "Offer"],
      deliveryMethods: ["Shipping", "In-Person"],
      costTypes: ["Flat Rate"],
      filters: {
        "Home Goods": {
          Type: ["None", "Furniture", "Appliances", "Rugs", "Utensils", "Dishes"],
        },
        "Sports": {
          Type: ["None", "Football", "Basketball", "Baseball", "Soccer", "Tennis"],
        },
        "Vehicles": {
          Make: "input",
          Model: "input",
          Year: "input",
          "Body Type": ["None", "Sedan", "Coupe", "SUV", "Hatchback", "Station Wagon", "Pickup Truck", "Sports Car", "Convertible", "Minivan", "Van"],
          Mileage: "input",
          "Interior Color": "input",
          "Exterior Color": "input",
          "Transmission Type": ["None", "Automatic", "Manual", "CVT"],
        },
        "Electronics": {
          Type: ["None", "Cell Phones", "Computers", "Cameras", "Video Games & Consoles", "Audio Devices", "Printers", "Cables & Adapters"],
        },
        "Pet Supplies": {
          Type: ["None", "Dog", "Cat", "Rodent", "Bird", "Reptile", "Fish"],
        },
        "Entertainment": {
          Type: ["None", "Books", "Movies", "Music", "Board/Card Games"],
        },
        "Clothing": {
          Type: ["None", "Business", "Casual", "Formal", "Sportswear"],
          Color: "input",
          Gender: ["None", "Male", "Female", "Other"],
          Size: ["None", "XX-Small", "X-Small", "Medium", "Large", "X-Large", "XX-Large"]
        },
        "Musical Instruments": {
          Type: ["None", "Stringed", "Brass", "Woodwind", "Percussion", "Keyboard"],
        },
      },
      selectedCategory: "",
      selectedDeliveryMethod: "",
      selectedCostType: "",
    }
  },
  mounted(){
    this.$store.dispatch("getShippingCarrierServices");
    this.$store.dispatch("getCurrentUser");
  },
  computed:{
    ShippingCarrierServices() {
      return this.$store.getters.CarrierServices;
    },
    currentUser() {
      return this.$store.getters.CurrentUser;
    }
  },
  methods:{
    setSelectedCategory() {
      this.selectedCategory = category.value;
    },
    setSelectedDeliveryMethod(deliveryMethod) {
      this.selectedDeliveryMethod = deliveryMethod;
    },
    setSelectedCostType() {
      this.selectedCostType = costType.value;
    },
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
  }
}
</script>

<style scoped>
.row {
  margin: 0;
}
.header {
  display: flex;
  justify-content: center;
}
.header > h2 {
  margin-top: 0.5rem;
}

.btn-new-prod{
    background-color: #DD7230;
    border: transparent;
    height: 45px;
}
.btn-new-prod:hover{
    background-color: #c8540b;
}
.btn-drop{
    background-color: #DD7230;
    border: transparent;
    height: 45px;
    width: 100%;
    text-align: initial;
}

span {
  font-size: 1.5rem;
}
</style>