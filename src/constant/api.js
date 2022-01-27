export const GET_REQUEST = "get";
export const POST_REQUEST = "post";

const ACCOUNT = "auth";
const ADMIN = "admin";
const CONSTANT = "constant";
const UPLOAD = "fileUpload";
const ALBUM_ART = "albumArt";


const FEEDBACK = "feedbacks";
const ITEM = "item";
const RECIPE = "recipe";
const INVENTORY = "inventory";
const ORDER = "order";
const USER = "user";
const OFFER = "offers";
const CATEGORIES = "categories";

const FIREBASE = "firebase";

const authApi = {
  adminLogin: {
    type: POST_REQUEST,
    path: `${ADMIN}/login`
  },
  updateAccount: {
    type: POST_REQUEST,
    path: `${ADMIN}/updateDistributor`
  },
  getAccount: {
    type: GET_REQUEST,
    path: `${ADMIN}`
  },
  logOut: {
    type: POST_REQUEST,
    path: `${ACCOUNT}/logout`
  },
  sendNotification: {
    type: POST_REQUEST,
    path: `${FIREBASE}`
  },
  getFeedbacks: {
    type: GET_REQUEST,
    path: `${FEEDBACK}`
  }
};

const adminApi = {
  addPublisher:{
    type: POST_REQUEST,
    path: `${ADMIN}/addPublisher`
  },
  getPublisher:{
    type: GET_REQUEST,
    path: `${ADMIN}/getPublisher`
  },
  addArtist: {
    type: POST_REQUEST,
    path: `${ADMIN}/addArtist`
  },
  getArtist: {
    type: GET_REQUEST,
    path: `${ADMIN}/getArtist`
  },
  getAlbumArt: {
    type: GET_REQUEST,
    path: `${ALBUM_ART}/getAlbumArtImages`
  },
  addAlbumArt: {
    type: POST_REQUEST,
    path: `${ALBUM_ART}/addAlbumArt`
  },
  addSong: {
    type: POST_REQUEST,
    path: `${ADMIN}/addSong`
  },
  updateSong: {
    type: POST_REQUEST,
    path: `${ADMIN}/updateSong`
  },
  getSong:{
    type: GET_REQUEST,
    path: `${ADMIN}/getSongs`
  },
  getPlaylist: {
    type: GET_REQUEST,
    path: `${ADMIN}/getPlaylist`
  },
  addPlaylist: {
    type: POST_REQUEST,
    path: `${ADMIN}/addPlaylist`
  },
  updatePlaylist: {
    type: POST_REQUEST,
    path: `${ADMIN}/updatePlaylist`
  },
  searchSongs: {
    type: POST_REQUEST,
    path: `${ADMIN}/searchSongs`
  },
  searchArtists: {
    type: POST_REQUEST,
    path: `${ADMIN}/searchArtists`
  },
  searchPlaylists: {
    type: POST_REQUEST,
    path: `${ADMIN}/searchPlaylists`
  },
  updateSongFeatured: {
    type: POST_REQUEST,
    path: `${ADMIN}/updateSongFeatured`
  },
  updateArtistFeatured: {
    type: POST_REQUEST,
    path: `${ADMIN}/updateArtistFeatured`
  },
  updatePlaylistFeatured: {
    type: POST_REQUEST,
    path: `${ADMIN}/updatePlaylistFeatured`
  },
  fetchSongFeatured: {
    type: GET_REQUEST,
    path: `${ADMIN}/fetchSongFeatured`
  },
  fetchArtistFeatured: {
    type: GET_REQUEST,
    path: `${ADMIN}/fetchArtistFeatured`
  },
  fetchPlaylistFeatured: {
    type: GET_REQUEST,
    path: `${ADMIN}/fetchPlaylistFeatured`
  },
}
const constantApi = {
  getConstantList: {
    type: GET_REQUEST,
    path: `${CONSTANT}/getConstantList`
  }
};
const categoriesApi = {
  getCategories: {
    type: GET_REQUEST,
    path: `${CATEGORIES}`
  }
};
const inventoryApi = {
  updateInventory: {
    type: POST_REQUEST,
    path: `${INVENTORY}/updateInventory`
  }
};
const orderApi = {
  getOrders: {
    type: GET_REQUEST,
    path: `${ORDER}`
  },
  isOrderPaid: {
    type: POST_REQUEST,
    path: `${ORDER}/isOrderPaid`
  },
  confirmDelivery: {
    type: POST_REQUEST,
    path: `${ORDER}/confirmDelivery`
  },
  getPendingOrdersCount: {
    type: GET_REQUEST,
    path: `${ORDER}/getPendingOrdersCount`
  }
};
const offerApi = {
  getOffer: {
    type: GET_REQUEST,
    path: `${OFFER}`
  },
  addOffer: {
    type: POST_REQUEST,
    path: `${OFFER}`
  },
  updateOffer: {
    type: POST_REQUEST,
    path: `${OFFER}/update`
  }
};
const userApi = {
  getUserInfo: {
    type: GET_REQUEST,
    path: `${USER}`
  }
};
const itemApi = {
  downloadItemsExcel: {
    type: POST_REQUEST,
    path: `${ITEM}/downloadItemsExcel`
  },
  searchItems: {
    type: GET_REQUEST,
    path: `${ITEM}/searchItems`
  },
  getItems: {
    type: GET_REQUEST,
    path: `${ITEM}`
  },
  orderItemList: {
    type: POST_REQUEST,
    path: `${ITEM}/orderItemList`
  },
  addItem: {
    type: POST_REQUEST,
    path: `${ITEM}`
  },
  updateItem: {
    type: POST_REQUEST,
    path: `${ITEM}/update`
  },
  updateMultipleItem: {
    type: POST_REQUEST,
    path: `${ITEM}/multiItemUpdate`
  },
  addMultipleItems: {
    type: POST_REQUEST,
    path: `${ITEM}/addMultipleItems`
  },
  deleteItem: {
    type: POST_REQUEST,
    path: `${ITEM}/delete`
  }
};
const recipeApi = {
  getRecipe: {
    type: GET_REQUEST,
    path: `${RECIPE}`
  },
  addRecipe: {
    type: POST_REQUEST,
    path: `${RECIPE}`
  },
  uploadRecipeImage: {
    type: POST_REQUEST,
    path: `${UPLOAD}/recipeImage`
  }
};
const fileApi = {
  getImages: { type: GET_REQUEST, path: `${UPLOAD}/getImages` },
  uploadImage: { type: POST_REQUEST, path: `${UPLOAD}/uploadImage` },
  uploadAlbumArt: { type: POST_REQUEST, path: `${UPLOAD}/uploadAlbumArt` },
  uploadSong: {type: POST_REQUEST, path: `${UPLOAD}/uploadSong`},
  // uploadExcel: { type: POST_REQUEST, path: `${ITEM}/uploadItemExcel` },
  uploadExcel: { type: POST_REQUEST, path: `${ITEM}/uploadIDItemExcel` },
  uploadItemExcelToDelete: {
    type: POST_REQUEST,
    path: `${ITEM}/uploadItemExcelToDelete`
  }
};
export {
  authApi,
  adminApi,
  constantApi,
  categoriesApi,
  fileApi,
  itemApi,
  recipeApi,
  inventoryApi,
  orderApi,
  offerApi,
  userApi
};
