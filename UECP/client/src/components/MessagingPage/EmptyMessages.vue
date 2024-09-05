<template>
    <div class="row">
        <div class="col-md">
            <img class="mt-5" src="../../assets/chat.png" alt=""><br>
            <label>Start chatting now</label>
        </div>
    </div>
</template>

<script>

export default{
    name: "EmptyMessages",
    data(){
        return{
        }
    }
}
</script>

<style scoped>
img{
    height: 150px;
    width: 150px;
}
.col-md{
    display: inline-grid;
    justify-content: center;
}
</style>