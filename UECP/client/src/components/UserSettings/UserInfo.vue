<template>
  <div class="row">
    <div class="col-md user-form">
      <form action="/api/updateCurUserInfo" method="POST" enctype="multipart/form-data" id="curUserInfoForm" @submit.prevent="updateCurUserInfo('#curUserInfoForm')">
        <div class="form-group">
          <label>Profile Picture</label>
          <br><input :disabled="isActive" autocomplete="off" name="image" type="file" ref="file" accept="image/*" class="form-control" id="imageFile">
        </div>
        <div class="form-group">
          <label>Username</label>
          <input disabled  name="username" autocomplete="off" class="form-control" :value="currentUser.username" placeholder="Username">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input disabled name="email" autocomplete="off" class="form-control" :value="currentUser.email" placeholder="example@email.com" >
        </div>
        <div class="form-group">
          <label>First Name</label>
          <input :disabled="isActive" autocomplete="new-password" name="firstName" class="form-control" :value="currentUser.fname" placeholder="First" >
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input :disabled="isActive" autocomplete="new-password" name="lastName" class="form-control" :value="currentUser.lname" placeholder="Last" >
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input :disabled="isActive" autocomplete="new-password" name="phoneNumber" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" class="form-control" :value="currentUser.phone_number" placeholder="123-456-7890">
        </div>
        <button v-if="isActive" @click="changeSubmitButton()" type="button" class="btn btn-primary">Edit Information</button>
        <button v-if="!isActive" type="submit" class="btn btn-primary" id="submitButton"><span>Save Changes</span></button>
      </form>
    </div>

    <div class="col-md user-form">
      <form action="/api/updateCurUserAddress" method="POST" enctype="multipart/form-data" id="curUserAddress" @submit.prevent="updateCurUserAddress('#curUserAddress')">
        <div class="form-group">
          <label>Address Line 1</label>
          <input :disabled="isActiveAddress" autocomplete="new-password" name="address_line_1" type="text" class="form-control" :value="currentUser.address.address_line_1" required v-if="currentUser.address">
          <input :disabled="isActiveAddress" autocomplete="new-password" name="address_line_1" type="text" class="form-control" required v-else>
        </div>
        <div class="form-group">
          <label>Address Line 2</label>
          <input :disabled="isActiveAddress" autocomplete="new-password" name="address_line_2" type="text" class="form-control" :value="currentUser.address.address_line_2" v-if="currentUser.address">
          <input :disabled="isActiveAddress" autocomplete="new-password" name="address_line_2" type="text" class="form-control" v-else>
        </div>
        <div class="form-group">
          <label>City</label>
          <input :disabled="isActiveAddress" autocomplete="new-password" name="admin_area_2" type="text" class="form-control" :value="currentUser.address.admin_area_2" required v-if="currentUser.address">
          <input :disabled="isActiveAddress" autocomplete="new-password" name="admin_area_2" type="text" class="form-control" required v-else>
        </div>

        <div class="form-group">
          <label>State/Province</label>
          <select :disabled="isActiveAddress" name="admin_area_1" class="form-select" required>
            <option disabled selected value="">Please Select State</option>
            <option v-for="stateName, stateCode in statesUS" :key="stateCode" :value="stateCode" :selected="currentUser.address.admin_area_1 === stateCode" v-if="currentUser.address">{{ stateName }}</option>
            <option v-for="stateName, stateCode in statesUS" :key="stateName" :value="stateCode" v-else>{{ stateName }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Zip/Postal code</label>
          <input :disabled="isActiveAddress" autocomplete="new-password" name="postal_code" type="text" class="form-control" :value="currentUser.address.postal_code" required v-if="currentUser.address">
          <input :disabled="isActiveAddress" autocomplete="new-password"  name="postal_code" type="text" class="form-control" required v-else>
        </div>

        <div class="form-group">
          <label>Country</label>
          <select :disabled="isActiveAddress" name="country" class="form-select" required>
            <option value="US" selected>United States</option>
          </select>
        </div>
        
        <button v-if="isActiveAddress" @click="changeSubmitAddressButton()" type="button" class="btn btn-primary">Edit Information</button>
        <button v-if="!isActiveAddress" type="submit" class="btn btn-primary" id="submitAddressButton"><span>Save Changes</span></button>
      </form>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'userInfo',
  data(){
    return{
      isActive: true,
      isActiveAddress: true,
      isLoading: false,
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
  mounted() {
    this.$store.dispatch('getCurrentUser')
  },
  computed: {
    currentUser() {
      return this.$store.getters.CurrentUser;
    }
  },
  methods:{
    changeSubmitButton(){
      this.isActive = !this.isActive
      if(this.isActive == false){
        this.$notify({
          type: 'info',
          text: "Fields Enabled",
        });
      }else{
        this.$notify({
          type: 'success',
          text: "Information Updated!",
        });
      }
    },
    changeSubmitAddressButton(){
      this.isActiveAddress = !this.isActiveAddress
      if(this.isActiveAddress == false){
        this.$notify({
          type: 'info',
          text: "Fields Enabled",
        });
      }else{
        this.$notify({
          type: 'success',
          text: "Information Updated!",
        });
      }
    },
    async updateCurUserInfo(formElement) {
      const btn = document.getElementById('submitButton');
      btn.classList.add("disabled");
      const btnText = btn.querySelector("span");
      btnText.innerHTML = ""
      btnText.classList.add("spinner-border");
      btnText.classList.add("spinner-border-sm");
      btnText.classList.add("mt-1");

      let form = this.$el.querySelector(formElement);
      let formData = new FormData();
      
      const fileInput = this.$refs.file;

      formData.append('firstName', form.firstName.value);
      formData.append('lastName', form.lastName.value);
      formData.append('phoneNumber', form.phoneNumber.value);
      if (fileInput.files.length !== 0) {
        formData.append('image', fileInput.files[0], fileInput.files[0].name);
      }

      await this.$store.dispatch('updateCurUserInfo', formData);
      
      btn.classList.remove("disabled");
      btnText.innerHTML = "Save Changes"
      btnText.classList.remove("spinner-border");
      btnText.classList.remove("spinner-border-sm");
      btnText.classList.remove("mt-1");

      this.isActive = true;

      this.$notify({
        type: 'success',
        text: "Information Updated!",
      });
    },
    async updateCurUserAddress(formElement) {
      const btn = document.getElementById('submitAddressButton');
      btn.classList.add("disabled");
      const btnText = btn.querySelector("span");
      btnText.innerHTML = ""
      btnText.classList.add("spinner-border");
      btnText.classList.add("spinner-border-sm");
      btnText.classList.add("mt-1");

      let form = this.$el.querySelector(formElement);
      let formData = new FormData();

      formData.append("address_line_1", form.address_line_1.value);
      formData.append("address_line_2", form.address_line_2.value);
      formData.append("admin_area_2", form.admin_area_2.value);
      formData.append("admin_area_1", form.admin_area_1.value);
      formData.append("postal_code", form.postal_code.value);
      formData.append("country_code", form.country.value);

      await this.$store.dispatch('updateCurUserAddress', formData);
      await this.$store.dispatch('getCurrentUser');
      
      btn.classList.remove("disabled");
      btnText.innerHTML = "Save Changes"
      btnText.classList.remove("spinner-border");
      btnText.classList.remove("spinner-border-sm");
      btnText.classList.remove("mt-1");

      this.isActiveAddress = true;

      this.$notify({
        type: 'success',
        text: "Information Updated!",
      });
    }
  }
}
</script>

<style scoped>
  .user-form{
    display: flex;
    justify-content: center;
    /* margin-left: 8%; */
  }
  form{
    box-sizing: border-box;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 16px 0px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
  margin-top: 24px;
  padding: 32px;
  width: 500px;
  }
form label{
  font-size: 14px;
}
button{
  width: 100%;
  border: none;
  height: 40px;
}
button:hover{
  transition: background-color ease 4s;
}
.form-group{
  margin-bottom: 1rem;
}

</style>