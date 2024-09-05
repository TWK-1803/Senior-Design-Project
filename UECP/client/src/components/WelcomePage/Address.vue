<template>
  <div class="vh-100 d-flex align-items-center p-4">
    <div class="container-sm">
      <div class="row justify-content-center">
        <div class="col-md-auto mt-4">
          <h2>Please enter your address information</h2>
        </div>
      </div>
      <div class="header mt-2">
        <h2>Address</h2>
      </div>
      <form id="addressForm" onsubmit="return false">
        <div class="mb-3">
          <label  class="form-label">Address Line 1</label>
          <input name="address_line_1" type="text" class="form-control" required autocomplete="new-password">
          <label  class="form-label mt-3">Address Line 2</label>
          <input name="address_line_2" type="text" class="form-control" autocomplete="new-password">
        </div>
        <div class="mb-3">
          <label class="form-label">City</label>
          <input name="admin_area_2" type="text" class="form-control" required autocomplete="new-password">
        </div>
        <div class="mb-3">
          <label class="form-label">State/Province</label>
          <select name="admin_area_1" class="form-select" required>
            <option disabled selected value="">Please Select State</option>
            <option v-for="stateName, stateCode in statesUS" :key="stateCode" :value="stateCode">{{ stateName }}</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Zip/Postal code</label>
          <input name="postal_code" type="text" class="form-control" required autocomplete="new-password">
        </div>

        <div class="mb-3">
          <label class="form-label">Country</label>
          <select name="country" id="country" class="form-select" required>
            <option value="US" selected>United States</option>
          </select>
        </div>
        <div class="footer my-4 d-flex justify-content-center">
          <button class="btn btn-light me-1" @click.prevent="skipToNextStep()">Skip</button>
          <button class="btn btn-primary ms-1" @click.stop="changeStep('#addressForm')">Next Step<img src="@/assets/arrow-right-s-line.png"></button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Address',
  data(){
    return{
      statesUS : {
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
      }
    }
  },
  components:{

  },
  mounted(){
  },
  computed:{
  },
  methods:{
    async changeStep(formElement) {
      let form = this.$el.querySelector(formElement);
      let formData = new FormData();

      if (form.address_line_1.value !== ""
      && form.admin_area_2.value !== "" 
      && form.admin_area_1.value !== "" 
      && form.postal_code.value !== "" 
      && form.country.value !== "") {
        formData.append("address_line_1", form.address_line_1.value);
        formData.append("address_line_2", form.address_line_2.value);
        formData.append("admin_area_2", form.admin_area_2.value);
        formData.append("admin_area_1", form.admin_area_1.value);
        formData.append("postal_code", form.postal_code.value);
        formData.append("country_code", form.country.value);
        await this.$store.dispatch('updateCurUserAddress', formData);
        this.$emit('changeStep', 'PayPalOnboardComponent');
      }
    },
    async skipToNextStep() {
      await this.$store.dispatch('skipCurUserAddressOnboarding');
      this.$emit('changeStep', 'PayPalOnboardComponent');
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
  padding: 10px 50px;
}
</style>