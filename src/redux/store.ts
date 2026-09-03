import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import cartReducer from "./slices/cart/cartSlice";
import wishlistReducer from "./slices/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
