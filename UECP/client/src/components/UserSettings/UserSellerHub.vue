<template>
    <div style="max-height: calc(100% - 80px); overflow-y: auto;" class="content">
        <h2 class="text-center">Active Listings</h2>
        <div style="overflow-x: auto; padding: 2%;">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th v-for="itemDetail in activeTableHead" :key="itemDetail">{{ itemDetail }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in activeTableData" :key="item">
                        <td v-for="itemDetail in item.slice(1)" :key="itemDetail">{{ itemDetail }}</td>
                        <td class="hub-icon">
                            <img style="cursor: pointer;" @click="NavigateToEditListing(item[0])" src="../../assets/pencil.png" alt="">
                            <img style="cursor: pointer;" @click="deleteItem(item[0])" class="mx-2" src="../../assets/delete.png" alt="">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <h2 class="text-center">Sold Listings</h2>
        <div style="overflow-x: auto; padding: 2%;">
            <div class="shippingListings">
            <h4>Shipping</h4>
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th v-for="itemDetail in soldShippingTableHead" :key="itemDetail">{{ itemDetail }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in soldShippingTableData" :key="item">
                        <td v-for="itemDetail in item.slice(6)" :key="itemDetail">{{ itemDetail }}</td>
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
                                <img v-if="item[1] === false" @click="setModalFeedbackTo(item.slice(4)[2], item.slice(3)[0], item.slice(2)[0])" style="cursor: pointer;" data-toggle="modal" data-target="#ratingModal" class="mx-2" src="../../assets/ratingNotSent.png" alt="">
                                <span class="tooltipNotSent">Leave feedback</span>
                            </span>
                            <span class="sentImg">
                                <img v-if="item[1] === true" class="mx-2" src="../../assets/ratingSent.png" alt="">
                                <span class="tooltipSent">Feedback sent</span>
                            </span>
                        </td>
                        <td v-if="item.slice(6)[soldShippingTableHead.findIndex(data => data == 'Label Created')] == false">
                            <button type="button" class="btn btn-primary" :id="item.slice(4)[0]" @click="createShippingLabel(item.slice(4)[1], item.slice(4)[0])" style="width: 210px; height: 40px;">
                                <span>Create Shipping Label</span>
                            </button>
                        </td>
                        <td v-if="item.slice(6)[soldShippingTableHead.findIndex(data => data == 'Label Created')] == true">
                            <a :href="getCurUserSellerOrders.filter((order) => order.orderDetails.itemID == item.slice(4)[1])[0].orderDetails.labelInfo.labelDownload.pdf" class="btn btn-primary" target="_blank" style="width: 185px; height: 40px;">Print Label</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div class="localPickupListings">
                <h4>Local Pickup</h4>
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th v-for="itemDetail in soldPickupTableHead" :key="itemDetail">{{ itemDetail }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in soldPickupTableData" :key="item">
                            <td v-for="itemDetail in item.slice(6)" :key="itemDetail">{{ itemDetail }}</td>
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
                                    <img v-if="item[1] === false" @click="setModalFeedbackTo(item.slice(4)[2], item.slice(3)[0], item.slice(2)[0])" style="cursor: pointer;" data-toggle="modal" data-target="#ratingModal" class="mx-2" src="../../assets/ratingNotSent.png" alt="">
                                    <span class="tooltipNotSent">Leave feedback</span>
                                </span>
                                <span class="sentImg">
                                    <img v-if="item[1] === true" class="mx-2" src="../../assets/ratingSent.png" alt="">
                                    <span class="tooltipSent">Feedback sent</span>
                                </span>
                            </td>
                            <td v-if="item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Code Generated')] == false">
                                <button type="button" class="btn btn-primary" :id="item.slice(4)[0]" @click="createPickupCode(item.slice(4)[1], item.slice(4)[0])" style="width: 185px; height: 40px;">
                                    <span>Send code to Buyer</span>
                                </button>
                            </td>
                            <td v-if="item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Code Generated')] == true" style="width: 201px;">
                                <form class="input-group mb-1 form-floating" v-if="item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Picked Up')] == false" @submit.prevent="confirmPickupCode(item.slice(4)[2], item.slice(4)[0])">
                                    <input type="text" class="form-control" :id="item.slice(4)[0]" @keypress="isNumber($event)" autocomplete="off" placeholder="123456" pattern="[0-9]{6}" required>
                                    <label for="code" style="z-index: 5;">Enter Code</label>
                                    <button class="btn btn-primary" :id="'btn' + item.slice(4)[0]">
                                        <span>
                                            <img src="@/assets/arrow-right-s-line.png">
                                        </span>
                                    </button>
                                </form>
                                <button type="button" v-if="item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Buyer Paid')] == false" class="btn btn-primary mt-1" :id="'btnMarkAsPaid' + item.slice(4)[0]" @click="markItemAsPaid(item.slice(4)[2], item.slice(4)[0])" style="width: 185px; height: 40px;">
                                    <span>Mark Item as Paid</span>
                                </button>
                                <span v-if="item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Buyer Paid')] == true && item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Code Generated')] == true && item.slice(6)[soldPickupTableHead.findIndex(data => data == 'Picked Up')] == true">None</span>
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
    name: "SellerHub",
    data() {
        return {
            activeTableHead: ["Title", "Category", "Deal Type", "Price", "Condition", "Delivery Method", "Last Updated", "Actions"],
            activeTableData: [],
            soldShippingTableHead: ["Order Number", "Item Title", "Price", "Order Status", "Buyer Paid", "Label Created", "Shipped", "Last Updated", "Feedback", "Actions"],
            soldShippingTableData: [],
            soldPickupTableHead: ["Order Number", "Item Title", "Price", "Order Status", "Buyer Paid", "Code Generated", "Picked Up", "Last Updated", "Feedback", "Actions"],
            soldPickupTableData: [],
            modalFeedbackTo: '',
            modalFeedbackToID: '',
            modalFeedbackToOrderID: '',
            starSelected: 0,
        }
    },
    async mounted(){
        await this.$store.dispatch('getCurrentUser');
        await this.$store.dispatch('getCurUserItems');
        await this.$store.dispatch('getOrders');
        this.getCurUserItems.forEach(item => this.activeTableData.push([item._id, item.title, item.category, item.typeOfDeal, "$" + item.price, item.condition, Object.keys(item.deliveryMethod)[0], this.formatDate(item.updatedAt)]));
    },
    computed:{
        getCurrentUser() {
            return this.$store.getters.CurrentUser;
        },
        getCurUserItems() {
            return this.$store.getters.CurUserItems;
        },
        getCurUserSoldItems() {
            return this.$store.getters.CurUserSoldItems;
        },
        getCurUserSoldShippingItems() {
            return this.$store.getters.CurUserSoldItems.filter((item) => {return item.deliveryMethod['Shipping']});
        },
        getCurUserSoldPickupItems() {
            return this.$store.getters.CurUserSoldItems.filter((item) => {return item.deliveryMethod['In-Person']});
        },
        getCurUserSellerOrders() {
            return this.$store.getters.CurSellerOrders;
        },
        getCurUserBuyerOrders() {
            return this.$store.getters.CurBuyerOrders;
        },
    },
    watch: {
        getCurUserSellerOrders() {
            this.soldShippingTableData.length = 0;
            let i = 0;
            this.getCurUserSoldShippingItems.forEach((item) => {
                let index = this.getCurUserSellerOrders.findIndex(order => order.orderDetails.itemID == item._id);
                this.soldShippingTableData.push([
                    this.getCurUserSellerOrders[index].feedback.sellerReceived,
                    this.getCurUserSellerOrders[index].feedback.sellerSent,
                    this.getCurUserSellerOrders[index].orderDetails.buyerID,
                    this.getCurUserSellerOrders[index].orderDetails.buyerUsername,
                    `tableRowIndex${i}`,
                    item._id, 
                    this.getCurUserSellerOrders[index].orderID,
                    item.title, 
                    `$${item.price}`,
                    this.getCurUserSellerOrders[index].orderStatus, 
                    this.getCurUserSellerOrders[index].orderDetails.buyerPaid, 
                    this.getCurUserSellerOrders[index].orderDetails.labelCreated, 
                    this.getCurUserSellerOrders[index].orderDetails.itemShipped, 
                    this.formatDate(this.getCurUserSellerOrders[index].updatedAt)
                ]);
                i++;
            });
            this.soldPickupTableData.length = 0;
            let j = 0;
            this.getCurUserSoldPickupItems.forEach((item) => {
                let index = this.getCurUserSellerOrders.findIndex(order => order.orderDetails.itemID == item._id);
                this.soldPickupTableData.push([
                    this.getCurUserSellerOrders[index].feedback.sellerReceived,
                    this.getCurUserSellerOrders[index].feedback.sellerSent,
                    this.getCurUserSellerOrders[index].orderDetails.buyerID,
                    this.getCurUserSellerOrders[index].orderDetails.buyerUsername,
                    `tableRowPickupIndex${j}`,
                    item._id,
                    this.getCurUserSellerOrders[index].orderID,
                    item.title, 
                    `$${item.price}`, 
                    this.getCurUserSellerOrders[index].orderStatus, 
                    this.getCurUserSellerOrders[index].orderDetails.paid, 
                    this.getCurUserSellerOrders[index].orderDetails.codeGenerated, 
                    this.getCurUserSellerOrders[index].orderDetails.itemPickedUp, 
                    this.formatDate(this.getCurUserSellerOrders[index].updatedAt)
                ]);
                j++;
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
        createShippingLabel(itemID, tableRowIndex) {
            this.$store.dispatch('createShippingLabel', {
                itemID: itemID, 
                orderID: this.getCurUserSellerOrders.filter((order) => {return order.orderDetails.itemID == itemID})[0].orderID
            });
            const btn = document.querySelector(`#${tableRowIndex}`);
            btn.classList.add("disabled");
            const btnText = btn.querySelector("span");
            btnText.innerHTML = ""
            btnText.classList.add("spinner-border");
            btnText.classList.add("spinner-border-sm");
            btnText.classList.add("mt-1");
            this.$notify({
                type: 'Info',
                text: "Creating Shipping Label!",
            }); 
        },
        createPickupCode(itemID, tableRowIndex) {
            this.$store.dispatch('createPickupCode', {
                itemID: itemID,
                orderID: this.getCurUserSellerOrders.filter((order) => {return order.orderDetails.itemID == itemID})[0].orderID
            });
            const btn = document.querySelector(`#${tableRowIndex}`);
            btn.classList.add("disabled");
            const btnText = btn.querySelector("span");
            btnText.innerHTML = ""
            btnText.classList.add("spinner-border");
            btnText.classList.add("spinner-border-sm");
            btnText.classList.add("mt-1");
            this.$notify({
                type: 'Info',
                text: "Sending Code!",
            }); 
        },
        async confirmPickupCode(orderID, tableRowIndex) {
            let code = document.getElementById(tableRowIndex);
            const btn = document.getElementById(`btn${tableRowIndex}`);
            btn.classList.add("disabled");
            code.disabled = true;
            const btnText = btn.querySelector("span");
            btnText.innerHTML = ""
            btnText.classList.add("spinner-border");
            btnText.classList.add("spinner-border-sm");
            btnText.classList.add("mt-1");
            await this.$store.dispatch('confirmPickupCode', {
                orderID: orderID,
                code: code.value
            });
            if (this.$store.getters.codeConfirm.codeConfirm === false) {
                this.$notify({
                    type: 'error',
                    text: "Incorrect Code!",
                });
            } else if (this.$store.getters.codeConfirm.codeConfirm === true) {
                this.$notify({
                    type: 'success',
                    text: "Item Picked Up!",
                }); 
            }
        },
        markItemAsPaid(orderID, tableRowIndex) {
            this.$store.dispatch('markItemAsPaid', { orderID: orderID });
            const btn = document.getElementById(`btnMarkAsPaid${tableRowIndex}`);
            btn.classList.add("disabled");
            const btnText = btn.querySelector("span");
            btnText.innerHTML = ""
            btnText.classList.add("spinner-border");
            btnText.classList.add("spinner-border-sm");
            btnText.classList.add("mt-1");
            this.$notify({
                type: 'success',
                text: "Item Marked as Paid!",
            }); 
        },
        thousands_separators(num){
            if (num == null){
                num = 0
            }
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        },
        deleteItem(id){
            const response = confirm("Are you sure you want to delete this item?");
            if (response){
                this.$store.dispatch('deleteItem', id);
                this.$notify({
                    type: 'error',
                    text: "Item Deleted!",
                });
            }
            setTimeout(function(){
                window.location.reload()
            }, 1000) 
        },
        NavigateToEditListing(id){
            this.$router.push({name: 'edit', params: {id: id}});
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
    table{
        font-size: 15px;
    }
    @media only screen and (max-width: 1230px) {
        h1{
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