<template>
    <div class="list-group list-group-flush mx-3 mt-1">    
        <h1>Electronics</h1>
        <div class="mb-3">
            <label class="form-label"><b>Sort By:</b></label>
        </div>
        <div class="mb-3">
            <label class="form-label">Price Range</label>
            <div class="row">
                <div class="col">
                    <input id="minPrice" type="text" class="form-control" placeholder="Min" aria-label="Min" :onchange="filterMinPrice" @keypress="isNumber($event)">
                </div>
                <div class="col-md-auto">
                    <label class="form-label">to</label>
                </div>
                <div class="col">
                    <input id="maxPrice" type="text" class="form-control" placeholder="Max" aria-label="Max" :onchange="filterMaxPrice" @keypress="isNumber($event)">
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Condition</label>
            <select id="condition" class="form-select" :onchange="filterCondition">
                <option v-for="condition in this.conditions" :key="condition" v-bind:selected="condition == this.$route.query.condition">{{ condition }}</option>
            </select>
        </div>
        
        <div class="mb-3">
            <div class="row">
                <label for="inputState" class="form-label">Date Posted</label>
            </div>
            <div class="row">
                <label for="birthday">From:</label>
                <div class="mb">
                    <input type="date" id="fromDate" name="fromDate" :onchange="filterFromDate">
                </div>
            </div>
        <div class="row">
            <label for="birthday">To:</label>
            <div class="mb">
                <input type="date" id="toDate" name="toDate" :onchange="filterToDate">
            </div>
        </div>
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Delivery Method</label>
            <select id="deliveryMethod" class="form-select" :onchange="filterDeliveryMethod">
                <option v-for="deliveryMethod in this.deliveryMethods" :key="deliveryMethod" v-bind:selected="deliveryMethod == this.$route.query.deliveryMethod">{{ deliveryMethod }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Type</label>
            <select id="type" class="form-select" :onchange="filterType">
                <option v-for="itemType in this.types" :key="itemType" v-bind:selected="itemType == this.$route.query.type">{{ itemType }}</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ElectronicsFiltering',
    data() {
        return {
            conditions: ["None", "New", "Like New", "Used"],
            deliveryMethods: ["None", "Shipping", "In-Person"],
            types: ["None", "Cell Phones", "Computers", "Cameras", "Video Games & Consoles", "Audio Devices", "Printers", "Cables & Adapters"],
        }
    },
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
            } else {
                return true;
            }
        },
        filterMinPrice() {
            if (minPrice.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.minPrice;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "minPrice": minPrice.value }) });
            }
        },
        filterMaxPrice() {
            if (maxPrice.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.maxPrice;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "maxPrice": maxPrice.value }) });
            }
        },
        filterDeliveryMethod() {
            if (deliveryMethod.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.deliveryMethod;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "deliveryMethod": deliveryMethod.value }) });
            }
        },
        filterCondition() {
            if (condition.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.condition;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "condition": condition.value }) });
            }
        },
        filterFromDate() {
            console.log(fromDate.value);
            if (fromDate.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.fromDate;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "fromDate": fromDate.value }) });
            }
        },
        filterToDate() {
            console.log(toDate.value);
            if (toDate.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.toDate;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "toDate": toDate.value }) });
            }
        },
        filterType() {
            if (type.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.type;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "type": type.value }) });
            }
        },
    }
}
</script>

<style scoped>  
body {
background-color: #fbfbfb;
}
.btn-new-prod{
    background-color: #DD7230;
    border: transparent;
    height: 45px;
}
.btn-new-prod:hover{
    background-color: #c8540b;
}
h1{
    font-size: 25px;
    text-align: center;
    color: #c8540b;
}
</style>