<template>
<div class="container-fluid">
    <loadingSpinner v-if="itemLoaded === false"/>
    <div class="row mt-3" v-if="itemLoaded === true">
        <div class="col-md-6 px-5">
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                <div class="image-sizing">
                    <div class="carousel-inner">
                    <div class="carousel-item active">
                        <center><img class="d-block img-fluid" :src=this.Item.images[this.currentImage].url alt="..."/></center>
                    </div>
                </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span @click="previousImage()" v-if="Item.images.length > 1"><img src="../../assets/back.png" alt=""></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span  @click="nextImage()" v-if="Item.images.length > 1"><img src="../../assets/next.png" alt=""></span>
                    <span class="sr-only">Next</span>
                </a>
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
            </div>
        </div>
        <div class="col-md-6">
            <strong><h3 class="mt-2">{{ Item.title }} <span style="font-weight: lighter;">({{ Item.typeOfDeal }})</span></h3></strong>
            <h5>$ {{ thousands_separators( Item.price) }}</h5>
            <label>Condition: {{ Item.condition }}</label>
            <br>
            <label> Description: {{ Item.description }}</label>
            <br>
            <label v-if="Item.deliveryMethod && Item.deliveryMethod['In-Person']">Local Pick Up</label>
            <label v-if="Item.deliveryMethod && Item.deliveryMethod['Shipping']">Shipping</label><br>
            <span style="font-weight: lighter;">Published:  {{ formatDate( Item.createdAt) }}</span>
            <hr>
            <div class="row" >
                <div class="col-md-12">
                    <img :src="SellerInfo.profilePicture" class="rounded-circle profile-pic" alt="..." v-if="SellerInfo.profilePicture.split('/').slice(-1)[0] !== 'undefined'">
                    <span style="cursor: pointer;" @click="NavigateToProfile(Item.sellerID)">
                        <span class="mx-3">{{ SellerInfo.username }}</span>
                    </span>
                    <span class="fa fa-star checked" v-for="n in (SellerInfo.averageRatings)" :key="SellerInfo.averageRatings"></span>                    
                    <span class="fa fa-star" v-for="n in 5 - SellerInfo.averageRatings"></span>
                </div>
                <div class="col-md-12" v-if="!Item.length">
                    <span style="font-weight: lighter;" >Ratings: {{ SellerInfo.numRatings }}</span>
                </div>                
            </div>
            <hr>
            <div class="row">
                <div class="col-mid-12" style="justify-items: center;">
                    <!-- <form method="POST" action="/api/inPersonBuy" enctype="multipart/form-data" id="inPersonBuyForm">
                        <input type="submit" class="button" value="Request to Buy in-person" @click="inPersonBuyForm(Item)" data-toggle="modal" data-target="#exampleModal">
                    </form> -->
                    <input type="submit" class="button" value="Buy Now" @click="NavigateToCheckout(Item._id)" v-if="!IsOwnListing">
                    <input type="submit" class="button" value="Chat" @click="NavigateToMessaging()" v-if="!IsOwnListing">
                </div>
            </div>
            <!-- modal -->
            <div class="modal fade animate__animated" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                <span>&#10004; </span>Email Sent to {{ SellerInfo.username }}
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import loadingSpinner from '@/components/GeneralComponents/LoadingSpinner.vue'

export default{
    name: "productListing",
    data(){
        return{
            currentImage: 0,
            itemLoaded: false
        }
    },
    components: {
        loadingSpinner,
    },
    async mounted(){
        this.itemLoaded = false;
        await this.$store.dispatch('getItem', this.$route.params.id);
        await this.$store.dispatch('getCurrentUser');
        this.itemLoaded = true;
    },
    computed:{
        Item(){
            return this.$store.getters.Item;
        },
        SellerInfo(){
            if (this.$store.getters.SellerInfo) {
                if (Object.keys(this.$store.getters.SellerInfo).length !== 0){
                    if(Object.keys(this.$store.getters.SellerInfo.ratings).length !== 0){
                        let sumratings = 0;
                        let numratings = 0;
                        this.$store.getters.SellerInfo.ratings.forEach(element => {
                            sumratings += element.stars;
                            numratings += 1;
                        });
                        return {"username": this.$store.getters.SellerInfo.username, "numRatings": numratings, "averageRatings": Math.floor(sumratings/numratings), "profilePicture": this.$store.getters.SellerInfo.profilePicture};
                    }
                    else{
                        return {"username":this.$store.getters.SellerInfo.username, "numRatings":0, "averageRatings": 0, "profilePicture": this.$store.getters.SellerInfo.profilePicture};
                    }
                }
                else{
                    return {"numRatings":0, "averageRatings": 0};
                }
            }
        },
        CurrentUser() {
            return this.$store.getters.CurrentUser;
        },
        IsOwnListing() {
            if (this.Item.sellerID === undefined || this.CurrentUser._id === undefined){ return true }
            else { return (this.Item.sellerID === this.CurrentUser._id); }
        },
    },  
    methods:{
        nextImage() {
            this.currentImage = (this.currentImage + 1) % this.Item.images.length;
        },

        previousImage(){
            this.currentImage = (this.currentImage + this.Item.images.length - 1) % this.Item.images.length;
        },
        NavigateToProfile(id){
            this.$router.replace({name: 'profile', params: {id: id}});
        },
        inPersonBuyForm(item) {
            let form = document.getElementById('inPersonBuyForm');
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                axios({
                    method: 'post',
                    url: `/api/inPersonBuy/${item.id}`,
                    data: {
                        itemData: item
                    },
                    proxy: {
                        host: "localhost",
                        port: 3000,
                    }
                });
            });
        },
        NavigateToCheckout(id) {
            this.$router.push({name: 'checkout', params: {id: id}});
        },
        async NavigateToMessaging(){
            await this.$store.dispatch('getConversationID', {user1: this.CurrentUser._id, user2: this.Item.sellerID});
            if(this.$store.getters.ConversationID.length === 0){
                await this.$store.dispatch('createConversation', this.Item.sellerID);
            }
            this.$router.push({name: "messaging", params: {conversationid: this.$store.getters.ConversationID}});
        },
        thousands_separators(num){
            if (num == null){
                num = 0
            }
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        },
        formatDate(item_date){
            //format date to MM/DD/YYYY
            const event = new Date(item_date)
            return event.toLocaleString('en-us',{month:'long', day: 'numeric', year: 'numeric'})
        }
    }
}
</script>

<style scoped>
.image-sizing img{
    max-height: 500px;
    height: auto;
}
    span{
        font-size: 13px;
        font-weight: bold;
        text-transform: uppercase;
    }
    .profile-pic{
        height: 80px;
        width: 80px;
        object-fit: cover;
    }
    .checked {
    color: rgb(255, 190, 0);
    }
    h3{
        color: #024796;
    }
    @media only screen and (max-width: 758px) {
        .carousel-item img{
            height: 100%;
        }
        .col-md-6{
            padding: 5vh;
            padding-right: 2vh;
        }
        .checked{
            font-size: 10px;
        }
    }
    .close {
        border: none;
        background: none;
    }
    .close > span {
        font-size: 1.5rem;
        transition: 0.1s;
    }
    .close > span:hover {
        color: #DD7230;
    }
    .modal-title > span {
        color: green;
        font-size: 1.5rem;
    }
    .button {
        border: none;
        margin-right: 10px;
        background-color: #e5e5e5;
        border-radius: 5px;
        padding: 5px 10px;
        color: #4A4A4A;
        transition: 0.1s;
    }
    .button:hover {
        color: #DD7230;
        background-color: #e0e0e0;
    }
</style>