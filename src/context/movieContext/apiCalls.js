import axiosInstance from "../../api/axiosInstance";
import { createMovieFailure, createMovieStart, createMovieSuccess, deleteMovieFailure, deleteMovieStart, deleteMovieSuccess, getMoviesFailure, getMoviesStart, getMoviesSuccess } from "./MovieAction";

export const getMovies = async (dispatch) => {
    dispatch(getMoviesStart());
    try {
        const res = await axiosInstance.get(`movies/`);
        dispatch(getMoviesSuccess(res.data));
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        dispatch(getMoviesFailure());
    }
};

export const createMovie = async (movie, dispatch,navigate) => {
    dispatch(createMovieStart());
    try {
        const res = await axiosInstance.post(`movies/`, movie);
        dispatch(createMovieSuccess(res.data));
        navigate('/movies')
    } catch (error) {
        console.error("Failed to create movies:", error);
        dispatch(createMovieFailure());
    }
};

export const deleteMovie = async (id, dispatch) => {
    dispatch(deleteMovieStart());
    try {
        await axiosInstance.delete(`movies/${id}`);
        dispatch(deleteMovieSuccess(id));
    } catch (error) {
        console.error("Failed to delete movies:", error);
        dispatch(deleteMovieFailure());
    }
};
