import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers/RootReducer";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage,
    serialize: (state) => JSON.stringify(state),
    deserialize: (state) => JSON.parse(state),
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk],
})

export const persistor = persistStore(store);