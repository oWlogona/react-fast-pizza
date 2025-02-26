import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      state.cart.push(action.payload);
    },
    deleteItem: {
      prepare(id) {
        return { payload: { id } };
      },
      reducer(state, action) {
        state.cart = state.cart.filter(
          (pizza) => pizza.pizzaId !== action.payload.id
        );
      },
    },
    increaseItemQuantity: {
      prepare(id) {
        return { payload: { id } };
      },
      reducer(state, action) {
        const pizza = state.cart.find(
          (pizza) => pizza.pizzaId === action.payload.id
        );
        pizza.quantity++;
        pizza.totalPrice = pizza.quantity * pizza.unitPrice;
      },
    },

    decreaseItemQuantity: {
      prepare(id) {
        return { payload: { id } };
      },
      reducer(state, action) {
        const pizza = state.cart.find(
          (pizza) => pizza.pizzaId === action.payload.id
        );
        pizza.quantity--;
        pizza.totalPrice = pizza.quantity * pizza.unitPrice;
        if (pizza.quantity === 0)
          cartSlice.caseReducers.deleteItem(state, action);
      },
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// reselect lib
export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getCart = (state) => state.cart.cart;

export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((pizza) => pizza.pizzaId === id)?.quantity ?? 0;
