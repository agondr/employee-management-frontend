import { createSlice} from '@reduxjs/toolkit';
import store from '.';
const storedUser = JSON.parse(localStorage.getItem('user'));
const storedToken = JSON.parse(localStorage.getItem('token'));
const initialState = {
    isAuthenticated: !!storedToken,
    user: storedUser || null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        }
    },
}); 
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;