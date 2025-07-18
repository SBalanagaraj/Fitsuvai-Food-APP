import {createSlice} from '@reduxjs/toolkit';

// {
//   "subtotal": "1150",
//   "sgst": "57.50",
//   "cgst": "34.50",
//   "sgst_percent": "0.00",
//   "cgst_percent": "0.00",
//   "delivery_fee": "10.49",
//   "total_amount": "1262.49",
//   "amount_reduced": "2",
//   "reward_percentage": "12",
//   "reward_point": "151",
//   "points_redeemed": "151",
//   "vesselPrice": "10",
//   "vesselName": "Aluminium foil tray",
//   "transaction_id": "",
//   "discount_amount": "0.00",
//   "package_fee": "10.00",
//   "payment_status": "paid",
//   "delivery_date": "30-09-2024",
//   "delivery_time": "04:30 pm-09:00 pm",
//   "invoicePdf": "https://fitsuvai.bugtreat.org/orders/invoice/download/hQOb6s1jw31bjCWmg"
// }

const initialState = {
  cart: [],
  total: {
    subTotal: 0,
    taxAmount: 0,
    discount: {code: null, amount: null, percent: null},
    sgst: 0,
    cgst: 0,
    sgstPercent: 0,
    cgstPercent: 0,
    delfee: 0,
    totalamt: 0,
    amount_reduced: 0,
    reward_percentage: 0,
    reward_point: 0,
    points_redeemed: 0,
    pointsShown: 0,
    vesselPrice: 0,
    vesselName: '',
    kms: 0,
    totalProtein: '',
    totalCalories: '',
    totalCarbs: '',
    totalFats: '',
    totalMinerals: '',
    totalVitamins: '',
  },
  deleteModal: {isModal: false, item: {}},
  ifCoinApply: 0,
  coinHub: 0,
};

export const CartSlice = createSlice({
  name: 'cart',

  initialState,

  reducers: {
    AddToCart: (state, action) => {
      const itemPresent = state.cart.find(item => item.id == action.payload.id);
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({...action.payload, quantity: 1});
      }
    },
    removeFromCart: (state, action) => {
      const itemRemove = state.cart.filter(
        item => item.id !== action.payload.id,
      );
      state.cart = itemRemove;
    },
    incrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(item => item.id == action.payload.id);
      itemPresent.quantity++;
      let subTotal = state.cart.reduce((sum, item) => sum + item.offer, 0);
    },
    dicrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(item => item.id == action.payload.id);
      itemPresent.quantity--;
      let subTotal = state.cart.reduce((sum, item) => sum - item.offer, 0);
    },
    deleteWholeCart: (state, action) => {
      state.cart = [];
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setIfCoinApply: (state, action) => {
      state.ifCoinApply = action.payload;
    },
    setDeleteModal: (state, action) => {
      state.deleteModal = action.payload;
    },
    coinsCollector: (state, action) => {
      state.coinHub = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const {
  AddToCart,
  removeFromCart,
  incrementQuantity,
  dicrementQuantity,
  deleteWholeCart,
  setTotal,
  setIfCoinApply,
  coinsCollector,
  setDeleteModal,
  setCart,
} = CartSlice.actions;

export default CartSlice.reducer;
