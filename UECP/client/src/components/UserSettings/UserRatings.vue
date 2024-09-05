<template>
<div style="display: flex;">
  <div class="row">
    <div class="col-md" v-for="rating in currentUser.ratings" :key="rating.user" style="display:flex; justify-content: center;">
      <div class="row ratings">
        <!-- <div class="col-md img">
          <img src="../../assets/profile.jpg" alt="..." class="img-thumbnail">
          <label>{{ rating.user }}</label>
        </div> -->
        <div class="col-md">
          <!-- <img src="../../assets/rating.png" alt="" style="height: 50px; width: 50px;"> -->
          <span class="fa fa-star checked" v-for="n in rating.stars" :key="n.index"></span>
          <span class="fa fa-star" v-for="n in 5 - rating.stars" :key="n.index"></span>
          <br>
          <span>{{ rating.comment }}</span>
          <br>
          <br>
          <span class="item">For item: {{ rating.itemTitle }}</span>
          <br>
          <span class="ratingBy">Rating by: {{ rating.ratingBy }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Ratings",
  data() {
    return {
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
}
</script>

<style scoped>
  .ratings{
    box-sizing: border-box;
    border-radius: 8px;
    background-color: white;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 16px 0px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
    margin-top: 24px;
    padding: 32px;
    width: 350px;
  }
  .img label{
    display: flex;
    justify-content: center;
  }
  .ratingBy{
    font-weight: lighter;
    font-size: 12px;
  }
  .checked {
    color: rgb(255, 190, 0);
  }
  @media only screen and (max-width: 765px) {
    .ratings{
      width: 300px;
    }
  }
</style>