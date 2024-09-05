<template>
    <div class="row">
    <div class="col-md user-form">
      <form action="/api/updateCurUserSocials" method="POST" enctype="multipart/form-data">
        <h4>Settings</h4>
        <div class="input-group">
            <span class="input-group-text"><img src="../../assets/ig.png" alt=""></span>
            <input :disabled="isActive"  name="instagram" type="text" class="form-control textbox" :value="currentUser.socials.instagram" :placeholder="currentUser.socials.instagram">
          </div>
          <div class="input-group">
            <span class="input-group-text"><img src="../../assets/snapchat.png" alt=""></span>
            <input :disabled="isActive"  name="snapchat" type="text" class="form-control" :value="currentUser.socials.snapchat" :placeholder="currentUser.socials.snapchat" >
          </div>
          <div class="input-group">
            <span class="input-group-text"><img src="../../assets/facebook.png" alt=""></span>
            <input :disabled="isActive" name="facebook" type="text" class="form-control" :value="currentUser.socials.facebook"  :placeholder="currentUser.socials.facebook" >
          </div>
          <button type="button" v-if="isActive" class="btn btn-primary" @click="editUserSettings()">Edit Account</button>
          <button type="submit" v-if="!isActive" class="btn btn-primary">Save Changes</button>
      </form>
    </div>
  </div>

</template>

<script>
export default {
  name: "Settings",
  data(){
    return{
      ig: "",
      snap: "",
      fb: "",
      btnText: "Edit Account",
      isActive: true
    };
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
    editUserSettings(){
      if(this.isActive){
        this.enableTextBoxes()
      }else{
        this.enableTextBoxes()
        this.$notify({
                type: 'success',
                text: "Account Updated!",
            });
      }
    },
    enableTextBoxes(){
      this.isActive = !this.isActive
      this.$notify({
                type: 'info',
                text: "Fields Enabled!",
            });
    }
  }
}
</script>

<style scoped>
span .input-group-text{
  background-color: transparent !important;
  border-radius: none;
}
.input-group{
  margin-bottom: 5%;
}
.form-control{
  height: 45px;
}
.input-group span{
  height: 45px;
}
.input-group span img{
  height: 30px;
  width: 30px;
}


.user-form{
    display: flex;
    justify-content: center;
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
  min-height: 300px;
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
</style>