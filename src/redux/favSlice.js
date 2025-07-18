import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {url} from '../utilities/appApi';
import {print} from '../utilities/helperFunction';

export const listProductApi = createAsyncThunk(
  'listProductApi',
  async (_, {getState}) => {
    try {
      const state = getState();
      const formData = new FormData();
      formData.append('context', 'collectionsAndProducts');
      if (state?.setting?.userSettings?.userInfo?.user_id) {
        formData.append(
          'userId',
          state?.setting?.userSettings?.userInfo?.user_id,
        );
      }

      const response = await fetch(url().wishList, {
        method: 'POST',
        body: formData,
      });
      if (response.status == 200) {
        const resParse = await response.json();
        // print(resParse, 'listProductApi');
        if (resParse.status == 'success') {
          return resParse;
        }
      } else {
        console.log(response.status, 'status-error listProductApi');
      }
    } catch (errror) {
      // console.log(errror, 'error in favList -> wishListApi');
    }
  },
);

export const addToFavApi = createAsyncThunk(
  'favListapi',
  async ({pId = '', collectionName = ''}, {getState, dispatch}) => {
    const state = getState();

    try {
      const formData = new FormData();
      // dispatch(setProdId(pId));
      if (state?.setting?.userSettings?.userInfo?.user_id) {
        formData.append(
          'userId',
          state?.setting?.userSettings?.userInfo?.user_id,
        );
      }
      if (pId != '') {
        formData.append('productId', pId);
      }
      if (
        state?.fav?.checkCollections &&
        state?.fav?.checkCollections.length > 0 &&
        collectionName == ''
      ) {
        // const collectionNames = state.fav.checkCollections.map(
        //   (item, index) => item.split('|')[0],
        // );
        if (state?.setting?.userSettings?.userInfo?.user_id) {
          formData.append(
            state?.setting?.userSettings?.userInfo?.user_id,
            'userId',
          );
        }
        formData.append('collection', state.fav.checkCollections.join(','));
      } else if (collectionName != '') {
        formData.append('collection', collectionName);
      }
      formData.append('context', 'addToFav');
      const wishlistUrl = url().wishList;
      const response = await fetch(wishlistUrl, {
        method: 'POST',
        body: formData,
      });
      // print(response, 'response');
      if (response.status == 200) {
        const resparse = await response.json();
        print(resparse, 'addToFavApi');
        if (resparse) {
          checked = resparse.status;
          dispatch(listProductApi());
          dispatch(setFavModal(false));
          return resparse;
        }
      } else {
        console.log('status-error addtofav');
        // setLoad(false);
      }
    } catch (error) {
      console.log(error, 'manageWishList');
      // setLoad(false);
    }
  },
);

const favSlice = createSlice({
  name: 'fav',
  initialState: {
    favList: [],
    collections: ['MyWishlist|0'],
    checkCollections: ['MyWishlist'],
    favModal: false,
    listLoader: false,
    prodId: '',
  },
  reducers: {
    setFavList: (state, action) => {
      state.favList.push(action.payload);
    },
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
    setProdId: (state, action) => {
      state.prodId = action.payload;
    },
    setCheckCollections: (state, action) => {
      const collectionIsPresent = state.checkCollections.find(item => {
        return item == action.payload;
      });
      if (collectionIsPresent) {
        const itemRemove = state.checkCollections.filter(item => {
          return item !== action.payload;
        });
        state.checkCollections = itemRemove;
      } else {
        state.checkCollections.push(action.payload);
      }
    },
    setInitialCheckCollections: (state, action) => {
      if (action.payload != null && action.payload) {
        state.checkCollections = action.payload;
      } else {
        state.checkCollections = [];
      }
    },
    setFavModal: (state, action) => {
      state.favModal = action.payload;
    },
  },
  extraReducers: builder => {
    // collectionsAndProducts
    builder.addCase(listProductApi.fulfilled, (state, action) => {
      if (action.payload != undefined) {
        state.favList = action.payload.products.split(',');
        state.collections = action.payload.collections;
        // print(action.payload.collections, 'collect');
        const checkCollectionsVarFilter = action.payload.collections.filter(
          data => {
            return (
              state.checkCollections.includes(data.split('|')[0]) &&
              data.split('|')[0]
            );
          },
        );
        const checkCollectionsVar = checkCollectionsVarFilter.map(data => {
          return data.split('|')[0];
        });
        state.checkCollections = checkCollectionsVar;
        state.listLoader = false;
      }
    });
    builder.addCase(listProductApi.pending, (state, action) => {
      state.listLoader = true;
    });
    builder.addCase(listProductApi.rejected, (state, action) => {
      state.listLoader = false;
    });

    // addToFav:
    builder.addCase(addToFavApi.fulfilled, (state, action) => {
      state.favList = action.payload.data.split(',');
    });
    builder.addCase(addToFavApi.pending, (state, action) => {
      state.listLoader = true;
    });
    builder.addCase(addToFavApi.rejected, (state, action) => {
      state.listLoader = false;
    });
  },
});

export const {
  setCollections,
  setCheckCollections,
  setInitialCheckCollections,
  setFavModal,
  setFavList,
  setProdId,
} = favSlice.actions;
export default favSlice.reducer;
