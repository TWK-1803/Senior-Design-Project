<template>
    <div class="list-group list-group-flush mx-3 mt-1">
        <h1>Clothing</h1>    
        <div class="mb-3">
            <label class="form-label"><b>Sort By:</b></label>
        </div>
        <div class="mb-3">
            <label class="form-label">Price Range</label>
            <div class="row">
                <div class="col">
                    <input id="minPrice" type="text" class="form-control" placeholder="Min" aria-label="Min" :onchange="filterMinPrice">
                </div>
                <div class="col-md-auto">
                    <label class="form-label">to</label>
                </div>
                <div class="col">
                    <input id="maxPrice" type="text" class="form-control" placeholder="Max" aria-label="Max" :onchange="filterMaxPrice">
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
        <div class="mb-3">
            <label for="inputState" class="form-label">Color</label>
            <input type="text" id="color" class="form-control" placeholder="e.g. blue" aria-label="e.g. blue" :onchange="filterColor">
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Gender</label>
            <select id="gender" class="form-select" :onchange="filterGender">
                <option v-for="gender in this.genders" :key="gender" v-bind:selected="gender == this.$route.query.gender">{{ gender }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Size</label>
            <select id="size" class="form-select" :onchange="filterSize">
                <option v-for="size in this.sizes" :key="size" v-bind:selected="size == this.$route.query.size">{{ size }}</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ClothingFiltering',
    data() {
        return {
            conditions: ["None", "New", "Like New", "Used"],
            deliveryMethods: ["None", "Shipping", "In-Person"],
            types: ["None", "Business", "Casual", "Formal", "Sportswear"],
            genders: ["None", "Male", "Female", "Other"],
            sizes: ["None", "XX-Small", "X-Small", "Medium", "Large", "X-Large", "XX-Large"]
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
        filterColor() {
            if (color.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.color;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "color": color.value }) });
            }
        },
        filterGender() {
            if (gender.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.type;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "gender": gender.value }) });
            }
        },
        filterSize() {
            if (size.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.size;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "size": size.value }) });
            }
        }
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