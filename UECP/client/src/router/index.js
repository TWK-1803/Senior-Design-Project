import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";
import LandingPage from "../views/LandingPage.vue";
import UserSettings from "../views/UserSettings";
import ItemListing from "../views/ItemListing.vue";
import MessagingPage from "../views/MessagingPage.vue";
import UserProfile from "../views/UserProfile.vue";
import ItemCheckout from "../views/ItemCheckout.vue";
import EditItem from "../views/EditItem.vue";
import CreateListing from "../views/CreateListing.vue";
import CheckoutConfirmation from "../views/CheckoutConfirmation.vue";
import WelcomePage from "../views/Welcome.vue";
import ConfirmCode from "../views/ConfirmCode.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: LandingPage,
  },
  {
    path: "/welcome",
    name: "welcome",
    component: WelcomePage,
  },
  {
    path: "/createListing",
    name: "newListing",
    component: CreateListing,
  },
  {
    path: "/Settings",
    name: "settings",
    component: UserSettings,
  },
  {
    path: "/profile/:id",
    name: "profile",
    component: UserProfile,
  },
  { path: "/listing/:id",
    name: "listing", 
    component: ItemListing,
  },
  {
    path: "/messaging/:conversationid?",
    name: "messaging",
    component: MessagingPage,
  },
  {
    path: "/editItem/:id",
    name: "edit",
    component: EditItem
  },
  {
    path: "/checkout/:id",
    name: "checkout",
    component: ItemCheckout,
  },
  {
    path: "/checkout/confirmation/:id",
    name: "confirmation",
    component: CheckoutConfirmation,
  },
  {
    path: "/confirmCode",
    name: "confirmCode",
    component: ConfirmCode,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

async function getCurUser() {
  const response = await axios({
    method: "get",
    url: "/api/getCurrentUser",
    proxy: {
      host: "localhost",
      port: 3000,
    }
  });

  return response;
}

router.beforeEach(async (to, from) => {
  let response = await getCurUser();
  if (((response.data.userOnboarding.addressComplete === false && response.data.userOnboarding.addressSkippedDuringWelcome === false) || (response.data.userOnboarding.paypalComplete === false && response.data.userOnboarding.paypalSkippedDuringWelcome === false)) && to.name !== "welcome") {
    return {name: "welcome"};
  } else if (((response.data.userOnboarding.addressComplete === false && response.data.userOnboarding.addressSkippedDuringWelcome === false) || (response.data.userOnboarding.paypalComplete === false && response.data.userOnboarding.paypalSkippedDuringWelcome === false)) && to.name == "welcome") {
    return true;
  } else if (((response.data.userOnboarding.addressComplete === true || response.data.userOnboarding.addressSkippedDuringWelcome === true) && (response.data.userOnboarding.paypalComplete === true || response.data.userOnboarding.paypalSkippedDuringWelcome === true)) && to.name == "welcome") {
    return {name: "home"};
  } else if (((response.data.userOnboarding.addressComplete === true || response.data.userOnboarding.addressSkippedDuringWelcome === true) && (response.data.userOnboarding.paypalComplete === true || response.data.userOnboarding.paypalSkippedDuringWelcome === true))) {
    return true;
  }
});

export default router;
