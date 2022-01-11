/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Ennoble Studios (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Ennoble Studios

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import Stars from "@material-ui/icons/Stars";
import Description from "@material-ui/icons/Description";
import EmojiEvents from "@material-ui/icons/LocalActivity";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
// import AudioTrack from "@material-ui/icons/AudioTrack";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import AddItems from "views/Items/addItems";
import ItemList from "views/Items/itemList";
import AddPlaylist from "views/Groups/addItems";
import PlaylistList from "views/Groups/itemList";
import AddOfferForm from "views/Offers/offerList/addOfferForm";
import OfferList from "views/Offers/offerList";
import { DistributorSetting } from "views/DistributorSetting";
import UploadImages from "views/UploadImages";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "mdi-view-dashboard",
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/addSong/:id",
    name: "Edit Song",
    rtlName: "Edit Song",
    icon: "mdi-food-apple",
    component: AddItems,
    layout: "/admin",
    isInnerPage: true
  },
  {
    path: "/addSong",
    name: "Add Songs",
    rtlName: "Add Songs",
    icon: "mdi-music",
    component: AddItems,
    layout: "/admin",
    isInnerPage: true
  },
  {
    path: "/itemList",
    name: "Song List",
    rtlName: "Song List",
    icon: "mdi-music",
    component: ItemList,
    layout: "/admin"
  },
  {
    path: "/addPlaylist/:id",
    name: "Edit Playlist",
    rtlName: "Edit Playlist",
    icon: "mdi-food-apple",
    component: AddPlaylist,
    layout: "/admin",
    isInnerPage: true
  },
  {
    path: "/addPlaylist",
    name: "Add Playlist",
    rtlName: "Add Playlist",
    icon: "mdi-music",
    component: AddPlaylist,
    layout: "/admin",
    isInnerPage: true
  },
  {
    path: "/playlist",
    name: "Playlists",
    rtlName: "Item List",
    icon: "mdi-playlist-music",
    component: PlaylistList,
    layout: "/admin"
  },
  {
    path: "/addOffer",
    name: "Offers",
    rtlName: "Offers",
    icon: "mdi-star",
    component: AddOfferForm,
    layout: "/admin",
    isInnerPage: true
  },
  {
    path: "/editOffer/:id",
    name: "Offers",
    rtlName: "Offers",
    icon: "mdi-star",
    component: AddOfferForm,
    layout: "/admin",
    isInnerPage: true
  },
  {
    path: "/offerList",
    name: "Offer List",
    rtlName: "Offer List",
    icon: "mdi-ticket",
    component: OfferList,
    layout: "/admin",
    isForVendor: true
  },
  {
    path: "/uploadImages",
    name: "Upload Images",
    rtlName: "Upload Images",
    icon: "mdi-image",
    component: UploadImages,
    layout: "/admin",
    isForVendor: true
  },
  // {
  //   path: "/distributorSettings",
  //   name: "Settings",
  //   rtlName: "Distributor Settings",
  //   icon: "mdi-settings",
  //   component: DistributorSetting,
  //   layout: "/admin"
  // },

  // {
  //   path: "/user",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: Person,
  //   component: UserProfile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/table",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "content_paste",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   component: Typography,
  //   layout: "/admin"
  // },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin",
    isInnerPage: true
  }
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: LocationOn,
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/admin"
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   component: RTLPage,
  //   layout: "/rtl"
  // },
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   rtlName: "التطور للاحترافية",
  //   icon: Unarchive,
  //   component: UpgradeToPro,
  //   layout: "/admin"
  // }
];

export default dashboardRoutes;
