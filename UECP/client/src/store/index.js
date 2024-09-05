import { createStore } from "vuex";
import items from './modules/items';
import user from './modules/user';
import messages from "./modules/messages";
import orders from "./modules/orders";
import ratings from "./modules/ratings";

export default createStore({
  modules: {
    items,
    user,
    messages,
    orders,
    ratings,
  },
});
