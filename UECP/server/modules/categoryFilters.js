const filters = [];

const clothingFilters = { clothing : 
        ["priceRange", 
        "condition", 
        "datePosted",
        "deliveryMethod",
        "type", 
        "color", 
        "gender", 
        "size"]
}

const electronicsFilters = { electronics :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "type"]
}

const entertainmentFilters = { entertainment :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "type"]
}

const homeGoodsFilters = { homeGoods :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "type"]
}

const musicalInstrumentsFilters = { musicalInstruments :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "type"] 
}

const petSuppliesFilters = { petSupplies :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "animal"] 
}

const sportsFilters = { sports :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "type"]
}

const vehiclesFilters = { vehicles :
    ["priceRange",
    "condition",
    "datePosted",
    "deliveryMethod",
    "make", 
    "model", 
    "year", 
    "bodyType", 
    "mileage", 
    "exteriorColor", 
    "interiorColor", 
    "transmissionType"]
}

filters.push(clothingFilters, electronicsFilters, entertainmentFilters, homeGoodsFilters, musicalInstrumentsFilters, petSuppliesFilters, sportsFilters, vehiclesFilters);

module.exports = filters;