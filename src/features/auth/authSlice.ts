import { createSlice } from "@reduxjs/toolkit";

export const authInitialState:{
    userData: {
        email: string,
    }
} = {
    userData: {
        email: ''
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState,
    reducers: {
        saveUserData(state, action){
            state.userData = action.payload
        },
        clearUserData(state) {
            state.userData = { email: "" };
        },
    }
})

export const { saveUserData, clearUserData } = authSlice.actions
export default authSlice.reducer