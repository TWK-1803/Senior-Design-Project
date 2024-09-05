<template>
<div class="row">
    <div class="col-md-12 mt-4">
        <a href="/"><h1>U-MARKET</h1></a>
        <div id="mySidenav" class="sidenav">
  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
  <div class="menu" style="margin-top:20%">
    <hr/>
    <a href=""> <img class="side-menu-icon-profile rounded-circle" :src="currentUser.profilePicture" alt="" v-if="currentUser.profilePicture.split('/').slice(-1)[0] !== 'undefined'"><label style="margin-left:10px;">{{ currentUser.username }}</label></a>
    <hr/>
    <a href="/createListing" > <img class="side-menu-icon" src="../../assets/add.png" alt=""> New Product</a>
    <a :href="'/profile/'+ currentUser._id"> <img class="side-menu-icon" src="../../assets/website.png" alt=""> Profile</a>
    <a :href="'/messaging/'"><img class="side-menu-icon" src="../../assets/message.png" alt=""/>Messages</a>
    <a href="/settings"> <img class="side-menu-icon" src="../../assets/settings.png" alt=""> Settings</a>
    <hr/>
    <a href="/api/logout"> <img class="side-menu-icon" src="../../assets/logout.png" alt=""> Sign out</a>
    <hr/>
  </div>
</div>
<img cursor:pointer onclick="openNav()" class="menu-icon" src="../../assets/hamburger.png" alt="">
</div>
</div>
    <!-- Modal -->
    <!-- <div class="modal fade animate__animated animate__fadeInDown" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">New Product</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form action="/api/createItem" method="POST" enctype="multipart/form-data">
        <div class="modal-body">
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
                  <div class="form-check form-switch" v-for="condition in ItemConditions" :key="condition.index">
                <input class="form-check-input" :value="condition" v-model="this.condition" name="condition" type="checkbox" id="flexSwitchCheckDefault"   onclick="onlyOne(this)">
                <label class="form-check-label" name="condition"  for="flexSwitchCheckDefault">{{ condition }}</label>
                </div>
              </div>
        <label  class="mt-2 mb-3 form-label">Categories</label>
        <select class="mb-3 btn btn-secondary btn-drop" name="category" required>
            <option disabled value="">Please select one</option>
            <option  v-for="category in Categories" :key="category.index">{{ category }}</option>
        </select>
        <label  class="form-label">Price</label>
        <input name="price" type="text" class="form-control" placeholder="$200" required @keypress="isNumber($event)">
        <label  class="mt-3 mb-3 form-label">Type Of Deal</label>
        <select class=" mb-3 btn btn-secondary btn-drop" name="typeOfDeal" required>
            <option disabled value="">Please select one</option>
            <option  v-for="deal in TypeOfDeals" :key="deal.index">{{ deal }}</option>
        </select>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <input type="submit" class="btn btn-primary" value="Create" @click = onSubmit()>
      </div>
    </form>
    </div>
  </div>
</div> -->
</template>

<script>
export default {
    name:"HamburgerMenu",
    mounted(){
        this.$store.dispatch('getCategories')
        this.$store.dispatch('getTypeOfDeals')
        this.$store.dispatch('getCurrentUser')
        this.$store.dispatch('getItemConditions')
    },
    computed:{
        Categories(){
            return this.$store.getters.AllCategories;
        },
        TypeOfDeals(){
            return this.$store.getters.AllTypeOfDeals;
        },
        currentUser() {
      return this.$store.getters.CurrentUser;
        },
        ItemConditions(){
      return this.$store.getters.AllConditions;
    }
    },
    methods:{
      isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
        onSubmit(){
            location.reload();
            this.$notify({
            type: 'success',
            text: "Item Created!",
            });
        },
    }
}
</script>

<style scoped>
h1{
  font-weight: bold;
  color: #024796;
  margin-left: 10px;
}
.side-menu-icon-profile{
  height: 50px;
  width: 50px;
  border: 1px solid #e5e5e5;
}
.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #ffffff;
  overflow-x: hidden;
  transition: 0.5s;
  padding:0 0 60px 0;
}
.btn-drop{
    background-color: #DD7230;
    border: transparent;
    height: 45px;
    width: 100%;
    text-align: initial;
}
a{
  text-decoration: none;
}
.sidenav a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #000000;
  display: block;
  transition: 0.3s;
}

.sidenav a:hover {
  color: #DD7230;
}
.sidenav .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}
.menu-icon{
    height: 35px;
    width: 35px;
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 18px;
    margin-right: 5px;
  }
span{
    display: flex;
    justify-content: end;
}
.menu a{
    font-size: 15px;
    margin-left: 10px;
}
.side-menu-icon{
    height: 15px;
    width: 15px;
}
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}
</style>