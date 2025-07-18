import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  address: [],
};

export const AddressSlice = createSlice({
  name: 'address',

  initialState,

  reducers: {
    AddToaddress: (state, action) => {
      const itemPresent = state.address.find(
        item => item.name == action.payload.name,
      );
      if (itemPresent) {
        itemPresent;
      } else {
        state.address.push({...action.payload});
      }
    },
    removeFromaddress: (state, action) => {
      const itemRemove = state.address.filter(
        item => item.name !== action.payload.name,
      );
      state.address = itemRemove;
    },
  },
});

export const {AddToaddress, removeFromaddress} = AddressSlice.actions;

export default AddressSlice.reducer;
