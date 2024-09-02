import axiosInstance from "../../api/axiosInstance";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, getUsersFailure, getUsersStart, getUsersSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "./UserAction";

export const getUsers = async (dispatch) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosInstance.get(`users/`);
        dispatch(getUsersSuccess(res.data));
    } catch (error) {
        console.error("Failed to fetch users:", error);
        dispatch(getUsersFailure());
    }
}

export const deleteUser = async (id, dispatch) => {
    dispatch(deleteUserStart());
    try {
        await axiosInstance.delete(`users/${id}`);
        dispatch(deleteUserSuccess(id));
    } catch (error) {
        console.error("Failed to delete user:", error);
        dispatch(deleteUserFailure());
    }
};

export const updateUser = async (user, dispatch, navigate) => {
    dispatch(updateUserStart());
    try {
        const res = await axiosInstance.put(`users/${user._id}`, user);
        dispatch(updateUserSuccess(res.data));
        navigate('/')
    } catch (error) {
        console.error("Failed to update user:", error);
        dispatch(updateUserFailure());
    }
};
