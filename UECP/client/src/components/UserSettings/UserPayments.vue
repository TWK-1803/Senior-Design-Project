<template>
  <div class="row">
    <div class="col-md user-form">
      <form action="/api/paypalOnboard" method="POST" enctype="multipart/form-data">
        <div class="input-group">
          <span class="input-group-text" id="inputGroupPrepend">
            <img src="../../assets/paypal.png" alt="">             
          </span>
          <input name="paypal" type="text" class="form-control" :value="currentUser.paymentMethods.paypal" :placeholder="paypal" disabled>
        </div>
        <button type="submit" style="height: 50px; width: 100%;" class="btn btn-primary submit">PayPal Onboard</button>
      </form>
      <br>
    </div>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <img src="" class="rounded mr-2" alt="...">
        <strong class="mr-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        Hello, world! This is a toast message.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Payments",
  data(){
    return{
      paypal: "@user-name",
      venmo: "@user-name",
      cashapp: "@user-name"
    };
  },
  mounted() {
    this.$store.dispatch('getCurrentUser')
  },
  computed: {
    currentUser() {
      return this.$store.getters.CurrentUser;
    }
  }
}
</script>
<style scoped>
.input-group-text{
  background-color: none;
  border-radius: none;
}
.input-group{
  margin-bottom: 2%;
}
.form-control{
  height: 50px;
}
.input-group span{
  height: 50px;
}
.input-group span img{
  height: 30px;
  width: 30px;
}

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
  min-height: 200px;
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
.rem-style{
  all: unset;
}
</style>