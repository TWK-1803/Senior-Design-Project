<template>
    <div class="list-group list-group-flush mx-3 mt-1">    
        <h1>Vehicles</h1>
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
            <label for="inputState" class="form-label">Make</label>
            <input type="text" id="make" class="form-control" placeholder="e.g. Honda" aria-label="e.g. Honda" :onchange="filterMake">
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Model</label>
            <input type="text" id="model" class="form-control" placeholder="e.g. Civic" aria-label="e.g. Civic" :onchange="filterModel">
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Year</label>
            <input type="text" id="year" class="form-control" placeholder="e.g. 2000" aria-label="e.g. 2000" :onchange="filterYear" @keypress="isNumber($event)">
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Body Type</label>
            <select id="bodyType" class="form-select" :onchange="filterBodyType">
                <option v-for="bodyType in this.bodyTypes" :key="bodyType" v-bind:selected="bodyType == this.$route.query.bodyType">{{ bodyType }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Mileage</label>
            <div class="row">
                <div class="col">
                    <input id="minMileage" type="text" class="form-control" placeholder="Min" aria-label="Min" :onchange="filterMinMileage" @keypress="isNumber($event)">
                </div>
                <div class="col-md-auto">
                    <label class="form-label">to</label>
                </div>
                <div class="col">
                    <input id="maxMileage" type="text" class="form-control" placeholder="Max" aria-label="Max" :onchange="filterMaxMileage" @keypress="isNumber($event)">
                </div>
            </div>
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Interior Color</label>
            <input type="text" id="interiorColor" class="form-control" placeholder="e.g. black" aria-label="e.g. black" :onchange="filterInteriorColor">
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Exterior Color</label>
            <input type="text" id="exteriorColor" class="form-control" placeholder="e.g. white" aria-label="e.g. white" :onchange="filterExteriorColor">
        </div>
        <div class="mb-3">
            <label for="inputState" class="form-label">Transmission Type</label>
            <select id="transmissionType" class="form-select" :onchange="filterTransmissionType">
                <option v-for="transmissionType in this.transmissionTypes" :key="transmissionType" v-bind:selected="transmissionType == this.$route.query.transmissionType">{{ transmissionType }}</option>
            </select>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VehiclesFiltering',
    data() {
        return {
            conditions: ["None", "New", "Like New", "Used"],
            deliveryMethods: ["None", "Shipping", "In-Person"],
            bodyTypes: ["None", "Sedan", "Coupe", "SUV", "Hatchback", "Station Wagon", "Pickup Truck", "Sports Car", "Convertible", "Minivan", "Van"],
            transmissionTypes: ["None", "Automatic", "Manual", "CVT"],
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
        filterMake() {
            if (make.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.make;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "make": make.value }) });
            }
        },
        filterModel() {
            if (model.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.model;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "model": model.value }) });
            }
        },
        filterYear() {
            if (year.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.year;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "year": year.value }) });
            }
        },
        filterBodyType() {
            if (bodyType.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.bodyType;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "bodyType": bodyType.value }) });
            }
        },
        filterMinMileage() {
            if (minMileage.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.minMileage;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "minMileage": minMileage.value }) });
            }
        },
        filterMaxMileage() {
            if (maxMileage.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.maxMileage;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "maxMileage": maxMileage.value }) });
            }
        },
        filterInteriorColor() {
            if (interiorColor.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.interiorColor;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "interiorColor": interiorColor.value }) });
            }
        },
        filterExteriorColor() {
            if (exteriorColor.value === "") {
                const queryParams = { ...this.$route.query };
                delete queryParams.exteriorColor;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "exteriorColor": exteriorColor.value }) });
            }
        },
        filterTransmissionType() {
            if (transmissionType.value === "None") {
                const queryParams = { ...this.$route.query };
                delete queryParams.transmissionType;
                this.$router.replace({ query: queryParams});
            } else {
                this.$router.push({ query: Object.assign({...this.$route.query}, { "transmissionType": transmissionType.value }) });
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