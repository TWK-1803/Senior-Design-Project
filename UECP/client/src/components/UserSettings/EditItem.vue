<template>
    <div class="container-fluid">
        <div class="row p-3" style="display: flex; justify-content: center;">
            <div class="col-md-6">
                <h5>Check any images you would like to delete from listing</h5>
                <div class="row">
                    <div class="col-md-4 delete-images" v-for="image in Item.images" :key="image">
                        <img class="p-3 rounded" :src=image.url alt="..." />
                        <input class="form-check-input mx-4 " type="checkbox" @click="deleteImage( image.url)" id="flexCheckDefault">
                    </div>
                </div>
            </div>
            <div class="col-md-6" >
                <form name="form" @submit.prevent="onSubmit">
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="mb-3">
                                <label  class="form-label">Upload More images</label>
                                <input id="images" name="image" class="form-control" type="file" ref="file" accept="image/*" multiple >
                            </div>
                            <label  class="form-label">Title</label>
                            <input name="title" type="text" class="form-control" v-model="title" :placeholder="Item.title">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <input name="description" class="form-control" id="exampleFormControlTextarea1" v-model="description" :placeholder="Item.description" >
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Item Condition</label><br>
                            <span>{{ Item.condition }}</span>
                            <div class="form-check form-switch" v-for="condition in ItemConditions" :key="condition.index">
                                <input class="form-check-input" :value="condition" name="condition" type="radio" id="flexSwitchCheckDefault" v-if="condition == Item.condition" checked>
                                <input class="form-check-input" :value="condition" name="condition" type="radio" id="flexSwitchCheckDefault" v-else>
                                <label class="form-check-label" name="condition"  for="flexSwitchCheckDefault">{{ condition }}</label>
                            </div>
                        </div>
                        <label  class="mt-2 form-label">Categories</label><br>
                        <span>{{ Item.category }} </span>
                        <select class="mb-3 mt-2 btn btn-secondary btn-drop" name="category" >
                            <option name="category" disabled value="">Please select one</option>
                            <option v-for="category in Categories" :key="category.index" v-bind:selected="category == Item.category">{{ category }}</option>
                        </select>
                        <label  class="form-label">Price</label>
                        <input name="price" type="text" class="form-control" v-model="price"  :placeholder="Item.price" @keypress="isNumber($event)">
                        <label  class="mt-3 form-label">Type Of Deal</label><br>
                        <span>{{ Item.typeOfDeal }}</span>
                        <select class=" mb-3 mt-2 btn btn-secondary btn-drop" name="typeOfDeal" >
                            <option name="typeOfDeal" disabled value="">Please select one</option>
                            <option v-for="deal in TypeOfDeals" :key="deal.index" v-bind:selected="deal == Item.typeOfDeal">{{ deal }}</option>
                        </select>

                    </div>
                    <div class="modal-footer">
                        <input type="submit" class="btn btn-primary mb-5" value="Update">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "editItem",
    data(){
        return{
            title: "",
            description: "",
            category: "",
            typeOfDeal: "",
            condition: "",
            price: "",
            images: [],
            countImages: 0,
            deleteImages: [],
        }
    },
    mounted(){
        this.$store.dispatch('getItem', this.$route.params.id)
        this.$store.dispatch('getCurrentUser'),
        this.$store.dispatch('getCategories'),
        this.$store.dispatch('getTypeOfDeals'),
        this.$store.dispatch('getItemConditions')
    },
    computed:{
        Item(){
            return this.$store.getters.Item;
        },
        SellerInfo(){
            if (Object.keys(this.$store.getters.SellerInfo).length !== 0){
                if(Object.keys(this.$store.getters.SellerInfo.ratings).length !== 0){
                    let sumratings = 0;
                    let numratings = 0;
                    this.$store.getters.SellerInfo.ratings.forEach(element => {
                        sumratings += element.rating;
                        numratings += 1;
                    });
                    return {"username": this.$store.getters.SellerInfo.username, "numRatings": numratings, "averageRatings": Math.floor(sumratings/numratings)};
                }
                else{
                    return {"username":this.$store.getters.SellerInfo.username, "numRatings":0, "averageRatings": 0};
                }
            }
            else{
                return {"numRatings":0, "averageRatings": 0};
            }
        },
        currentUser() {
            return this.$store.getters.CurrentUser;
        },
        Categories(){
            return this.$store.getters.AllCategories;
        },
        TypeOfDeals(){
            return this.$store.getters.AllTypeOfDeals;
        },
        ItemConditions(){
            return this.$store.getters.AllConditions;
        }
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
        isNumber(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        deleteImage(image){
                let url = new URL(image);
                let pathSplit = url.pathname.split('/');
                if (!this.deleteImages.includes(pathSplit[2])){
                    this.countImages +=1
                    this.deleteImages.push(pathSplit[2])
                    this.$notify({
                        type: 'info',
                        text: this.countImages + " image(s) selected",
                    });
                    console.log(this.deleteImages);
                }else{
                    var index = this.deleteImages.indexOf(pathSplit[2])
                    if( index > -1){
                        this.deleteImages.splice(index, 1)
                    }
                    this.countImages -= 1
                    console.log(this.deleteImages);
                }


        },
        onSubmit(e){
            const itemForm = new FormData();
            // retrieve info from form
            let title = e.target.elements.title.value;
            let description = e.target.elements.description.value;
            let condition = document.querySelectorAll('input[name=condition]:checked');
            let category = e.target.elements.category.value;
            let price = e.target.elements.price.value;
            let typeOfDeal = e.target.elements.typeOfDeal.value;
            let images = document.querySelector('#images');
            
            if (title !== "") {
                itemForm.append("title", title);
            }
            if (description !== "") {
                itemForm.append("description", description);
            }
            // condition will either be automatically set to original condition or user selected condition
            itemForm.append("condition", condition[0].value);
            // category will either be automatically set to original condition or user selected category
            itemForm.append("category", category);
            if (price !== "") {
                itemForm.append("price", price);
            }
            // typeOfDeal will either be automatically set to original typeOfDeal or user selected typeOfDeal
            itemForm.append("typeOfDeal", typeOfDeal);
            // add images to form if there are any
            for (let i = 0; i < images.files.length; i++) {
                itemForm.append("image", images.files[i]);
            }
            //pass the images to be deleted
            for (let i = 0; i < this.deleteImages.length; i++) {
                itemForm.append("deleteImages", this.deleteImages[i]);
            }
             itemForm.append("")
            // dispatches payload with id and formData
             this.$store.dispatch('editItem', {"id": this.$store.getters.Item._id, "formData": itemForm});
             this.$notify({
                type: 'success',
                text: "Item Updated!",
            });
             setTimeout(function(){
                window.location.reload()
            }, 1000)
        },
    }
}
</script>

<style scoped>
    .delete-images img{
        height: 250px;
        width: 250px;
    }
    span{
        font-size: 13px;
        font-weight: bold;
        text-transform: uppercase;
    }
    h4{
        display: flex;
        justify-content: center;
    }
  h3{
    color: #024796;
  }
  .btn-drop{
    background-color: #DD7230;
    border: transparent;
    height: 45px;
    width: 100%;
    text-align: initial;
}
  @media only screen and (max-width: 758px) {
    .carousel-item img{
        height: 50vh;
    }
    .col-md-6{
        padding: 5vh;
        padding-right: 2vh;
    }
    .checked{
        font-size: 10px;
    }
  }
</style>