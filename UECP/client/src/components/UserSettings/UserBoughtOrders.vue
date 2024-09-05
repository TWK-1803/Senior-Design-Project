<template>
    <div class="row content ms-3" style="max-height: calc(100% - 80px); overflow-y: auto; overflow-x: auto; padding: 2%;">
        <div class="col-md">
            <h2 class="text-center">Bought Orders</h2>
            <div class="shippingItems">
                <h4>Shipping</h4>
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th v-for="orderDetail in boughtShippingOrders" :key="orderDetail">{{ orderDetail }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in boughtShippingOrdersData" :key="item">
                            <td v-for="itemDetail in item.slice(4)" :key="itemDetail">
                                <span v-if="itemDetail === item.slice(4)[0]">
                                    <a :href="'/checkout/confirmation/' + itemDetail">{{ itemDetail }}</a>
                                </span>
                                <span v-else>
                                    {{ itemDetail }}
                                </span>
                            </td>
                            <td class="ratings-icons">
                                <span class="notReceivedImg">
                                    <img v-if="item[0] === false" src="../../assets/ratingNotReceived.png" alt="">
                                    <span class="tooltipNotReceived">Feedback not received</span>
                                </span>
                                <span class="receivedImg">
                                    <img v-if="item[0] === true" src="../../assets/ratingReceived.png" alt="">
                                    <span class="tooltipReceived">Feedback received</span>
                                </span>
                                <span class="notSentImg">
                                    <img v-if="item[1] === false" @click="setModalFeedbackTo(item.slice(4)[0], item.slice(3)[0], item.slice(2)[0])" style="cursor: pointer;" data-toggle="modal" data-target="#ratingModal" class="mx-2" src="../../assets/ratingNotSent.png" alt="">
                                    <span class="tooltipNotSent">Leave feedback</span>
                                </span>
                                <span class="sentImg">
                                    <img v-if="item[1] === true" class="mx-2" src="../../assets/ratingSent.png" alt="">
                                    <span class="tooltipSent">Feedback sent</span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="localPickupItems">
                <h4>Local Pickup</h4>
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th v-for="orderDetail in boughtPickupOrders" :key="orderDetail">{{ orderDetail }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in boughtPickupOrdersData" :key="item">
                            <td v-for="itemDetail in item.slice(4)" :key="itemDetail">
                                <span v-if="itemDetail === item.slice(4)[0]">
                                    <a :href="'/checkout/confirmation/' + itemDetail">{{ itemDetail }}</a>
                                </span>
                                <span v-else>
                                    {{ itemDetail }}
                                </span>    
                            </td>
                            <td class="ratings-icons containsTooltip">
                                <span class="notReceivedImg">
                                    <img v-if="item[0] === false" src="../../assets/ratingNotReceived.png" alt="">
                                    <span class="tooltipNotReceived">Feedback not received</span>
                                </span>
                                <span class="receivedImg">
                                    <img v-if="item[0] === true" src="../../assets/ratingReceived.png" alt="">
                                    <span class="tooltipReceived">Feedback received</span>
                                </span>
                                <span class="notSentImg">
                                    <img v-if="item[1] === false" @click="setModalFeedbackTo(item.slice(4)[0], item.slice(3)[0], item.slice(2)[0])" style="cursor: pointer;" data-toggle="modal" data-target="#ratingModal" class="mx-2" src="../../assets/ratingNotSent.png" alt="">
                                    <span class="tooltipNotSent">Leave feedback</span>
                                </span>
                                <span class="sentImg">
                                    <img v-if="item[1] === true" class="mx-2" src="../../assets/ratingSent.png" alt="">
                                    <span class="tooltipSent">Feedback sent</span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="modal fade" id="ratingModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Leave Feedback for {{ modalFeedbackTo }}</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="onModalClose();">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitFeedback()">
                        <h5>Rating:</h5>
                        <div class="stars d-flex">
                            <label v-for="star in 5" class="starLabel">
                                <div class="d-flex flex-column">
                                    <span class="fa fa-star checked" v-if="star <= starSelected" :id="'star' + star"></span>
                                    <span class="fa fa-star" v-if="star > starSelected" :id="'star' + star"></span>
                                    <input type="radio" v-model="starSelected" class="star" name="rating" :value="star" required>
                                </div>
                            </label>
                        </div>
                        <div class="textReview">
                            <h5>Feedback:</h5>
                            <input type="text" class="form-control" ref="feedbackInput" name="feedback" placeholder="Provide feedback" required>
                        </div>
                        <br>
                        <button type="submit" class="btn btn-primary" id="submitModalBtn" style="width: 155px">
                            <span>Leave Feedback</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "BoughtOrders",
    data() {
        return {
            boughtShippingOrders: ["Order Number", "Item Title", "Price", "Paid", "Order Status", "Label Created", "Shipped", "Last Updated", "Tracking", "Feedback"],
            boughtShippingOrdersData: [],
            boughtPickupOrders: ["Order Number", "Item Title", "Price", "Order Status", "Code", "Picked Up", "Last Updated", "Feedback"],
            boughtPickupOrdersData: [],
            modalFeedbackTo: '',
            modalFeedbackToID: '',
            modalFeedbackToOrderID: '',
            starSelected: 0,
        }
    },
    async created() {
        await this.$store.dispatch('getCurrentUser');
        await this.$store.dispatch('getCurUserBoughtItems');
        await this.$store.dispatch('updateCurUserTrackingInfo');
    },
    computed:{
        getCurrentUser() {
            return this.$store.getters.CurrentUser;
        },
        getCurUserBoughtItems() {
            return this.$store.getters.CurUserBoughtItems;
        },
        getCurUserBuyerOrders() {
            return this.$store.getters.CurBuyerOrders;
        },
        getCurUserBuyerShippingOrders() {
            return this.$store.getters.CurBuyerOrders.filter((order) => {return order.orderType === 'Shipping'});
        },
        getCurUserBuyerPickupOrders() {
            return this.$store.getters.CurBuyerOrders.filter((order) => {return order.orderType === 'Pickup'});
        },
        getCurUserBoughtShippingItems() {
            return this.$store.getters.CurUserBoughtItems.filter((item) => {return item.deliveryMethod['Shipping']});
        },
        getCurUserBoughtPickupItems() {
            return this.$store.getters.CurUserBoughtItems.filter((item) => {return item.deliveryMethod['In-Person']});
        }
    },
    watch: {
        getCurUserBuyerOrders() {
            this.boughtShippingOrdersData.length = 0;
            this.getCurUserBuyerShippingOrders.forEach(order => {
                let itemIndex = this.getCurUserBoughtShippingItems.findIndex(item => item._id === order.orderDetails.itemID);
                if (order.orderDetails.trackingInfo) {
                    this.boughtShippingOrdersData.push([
                        order.feedback.buyerReceived,
                        order.feedback.buyerSent,
                        order.orderDetails.sellerID,
                        order.orderDetails.sellerUsername,
                        order.orderID,
                        this.getCurUserBoughtShippingItems[itemIndex].title, 
                        `$${this.getCurUserBoughtShippingItems[itemIndex].price}`,
                        order.orderDetails.buyerPaid,
                        order.orderStatus,
                        order.orderDetails.labelCreated,
                        order.orderDetails.itemShipped,
                        this.formatDate(order.updatedAt),
                        order.orderDetails.trackingInfo.trackingNumber,
                    ]);
                } else {
                    this.boughtShippingOrdersData.push([
                        order.feedback.buyerReceived,
                        order.feedback.buyerSent,
                        order.orderDetails.sellerID,
                        order.orderDetails.sellerUsername,
                        order.orderID,
                        this.getCurUserBoughtShippingItems[itemIndex].title, 
                        `$${this.getCurUserBoughtShippingItems[itemIndex].price}`,
                        order.orderDetails.buyerPaid,
                        order.orderStatus,
                        order.orderDetails.labelCreated,
                        order.orderDetails.itemShipped,
                        this.formatDate(order.updatedAt),
                        "Not Created Yet",
                    ]);
                }
            });

            this.boughtPickupOrdersData.length = 0;
            this.getCurUserBuyerPickupOrders.forEach(order => {
                let itemIndex = this.getCurUserBoughtPickupItems.findIndex(item => item._id === order.orderDetails.itemID);
                this.boughtPickupOrdersData.push([
                    order.feedback.buyerReceived,
                    order.feedback.buyerSent,
                    order.orderDetails.sellerID,
                    order.orderDetails.sellerUsername,
                    order.orderID, this.getCurUserBoughtPickupItems[itemIndex].title, 
                    `$${this.getCurUserBoughtPickupItems[itemIndex].price}`,
                    order.orderStatus,
                    order.orderDetails.sixDigitCode,
                    order.orderDetails.itemPickedUp,
                    this.formatDate(order.updatedAt)
                ]);
            });
        }
    },
    methods:{
        onModalClose() {
            this.$refs.feedbackInput.value = '';
            this.starSelected = 0;
        },
        setModalFeedbackTo(orderID, feedbackTo, feedbackToID) {
            this.modalFeedbackTo = feedbackTo;
            this.modalFeedbackToOrderID = orderID;
            this.modalFeedbackToID = feedbackToID;
        },
        async submitFeedback() {
            const btn = document.querySelector(`#submitModalBtn`);
            btn.classList.add("disabled");
            const btnText = btn.querySelector("span");
            btnText.innerHTML = ""
            btnText.classList.add("spinner-border");
            btnText.classList.add("spinner-border-sm");
            btnText.classList.add("mt-1");

            let data = {
                userID: this.modalFeedbackToID,
                rating: {
                    starRating: this.starSelected,
                    feedback: this.$refs.feedbackInput.value,
                    orderID: this.modalFeedbackToOrderID,
                }
            };
            await this.$store.dispatch('createRating', data);

            // close modal
            $('#ratingModal').toggle();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            btn.classList.remove("disabled");
            btnText.innerHTML = "Leave Feedback"
            btnText.classList.remove("spinner-border");
            btnText.classList.remove("spinner-border-ms");
            btnText.classList.remove("mt-1");
            this.$refs.feedbackInput.value = '';
            this.starSelected = 0;
        },
        thousands_separators(num){
            if (num == null){
                num = 0
            }
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
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
        formatDate(item_date){
            //format date to MM/DD/YYYY
            const event = new Date(item_date)
            return event.toLocaleString('en-us',{month:'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})
        }
    } 
}
</script>

<style scoped>
    .hub-icon img{
        height: 20px;
        width: 20px;
        margin-top: 5% !important;
    }
    .ratings-icons img {
        height: 25px;
        width: 25px;
        margin-top: 5% !important;
    }
    @media only screen and (max-width: 993px) {
        h1{
            margin-left: 5%;
        }
    }
    @media only screen and (min-width:768px) and (max-width: 1260px ){
        .col-md{
            justify-content: left;
            margin-left: 5%;
        }
    }
    .content {
        box-sizing: border-box;
        border-radius: 8px;
        background-color: white;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 16px 0px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
        margin-top: 24px;
        padding: 32px;
    }
    .close {
        border: none;
        background: none;
        font-size: 2rem;
    }
    .star {
        opacity: 0;
        width: 14px;
        height: 1px;
    }
    .starLabel {
        padding: 2px;
    }
    .checked {
        color: rgb(255, 190, 0);
    }
    .notReceivedImg, .receivedImg, .notSentImg, .sentImg {
        position: relative;
    }
    .tooltipNotReceived, .tooltipReceived, .tooltipNotSent, .tooltipSent {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        z-index: 1;
        bottom: 150%;
        left: 50%;
        margin-left: -60px;
    }
    .tooltipNotReceived::after, .tooltipReceived::after, .tooltipNotSent::after, .tooltipSent::after{
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }
    .notReceivedImg:hover .tooltipNotReceived {
        visibility: visible;
    }
    .receivedImg:hover .tooltipReceived {
        visibility: visible;
    }
    .notSentImg:hover .tooltipNotSent {
        visibility: visible;
    }
    .sentImg:hover .tooltipSent {
        visibility: visible;
    }
</style>