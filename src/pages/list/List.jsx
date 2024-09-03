import { Link, useLocation } from "react-router-dom";
import "./list.css";
import { useNavigate } from "react-router-dom";
import { Publish } from '@mui/icons-material';
import { useState } from "react";
import { ListContext } from "../../context/listContext/ListContext";
import { useContext } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { getMovies } from "../../context/movieContext/apiCalls";
import { useEffect } from "react";
import { updateList } from "../../context/listContext/apiCalls";
export default function List() {

    const { dispatch } = useContext(ListContext)
    const { movies, dispatch: dispatchMovie } = useContext(MovieContext)

    useEffect(() => {
        getMovies(dispatchMovie)
    }, [dispatchMovie])


    const location = useLocation()
    const navigate = useNavigate()

    const list = location.state.list
    const genres = [
        { value: "Action", name: "Action" },
        { value: "Adventure", name: "Adventure" },
        { value: "Animation", name: "Animation" },
        { value: "Biography", name: "Biography" },
        { value: "Comedy", name: "Comedy" },
        { value: "Crime", name: "Crime" },
        { value: "Documentary", name: "Documentary" },
        { value: "Drama", name: "Drama" },
        { value: "Family", name: "Family" },
        { value: "Fantasy", name: "Fantasy" },
        { value: "Historical", name: "Historical" },
        { value: "Horror", name: "Horror" },
        { value: "Musical", name: "Musical" },
        { value: "Mystery", name: "Mystery" },
        { value: "Romance", name: "Romance" },
        { value: "Sci-Fi", name: "Sci-Fi" },
        { value: "Sports", name: "Sports" },
        { value: "Thriller", name: "Thriller" },
        { value: "War", name: "War" },
        { value: "Western", name: "Western" }
    ];

    const [listData, setListData] = useState(list)

    const handleChange = (e) => {
        const value = e.target.value
        setListData({ ...listData, [e.target.name]: value })
    }

    const handleChangeGenre = (event) => {
        const options = Array.from(event.target.selectedOptions, (option) => option.value);
        setListData((prevList) => ({ ...prevList, genre: options }));

    };

    const handleChangeContent = (event) => {
        const options = Array.from(event.target.selectedOptions, (option) => option.value);
        setListData((prevList) => ({ ...prevList, content: options }));

    };

    const handleSubmit = (e) => {
        e.preventDefault()
        updateList(listData, dispatch,navigate)
      }


    console.log(listData)
    return (
        <div className="product">
            <div className="productTitleContainer">
                <h1 className="productTitle">List</h1>
                <Link to="/newList">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopRight">
                    <div className="productInfoTop">
                        <span className="productName">{listData.title}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">id:</span>
                            <span className="productInfoValue"> {listData._id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Genre:</span>
                            <span className="productInfoValue">{listData.genre[0]}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Type:</span>
                            <span className="productInfoValue">{listData.type}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">

                    <div className="productFormLeft">
                        <label>List Name</label>
                        <input type="text" placeholder={listData.title} value={listData.title} name="title" onChange={handleChange} />
                        <label>Type</label>
                        <input type="text" placeholder={listData.type} value={listData.type} name="typ" onChange={handleChange} />

                        <label>Genre</label>
                        <select
                            multiple
                            value={listData.genre}
                            name="genre"
                            id="genre"
                            style={{ height: '300px',width:'300px' }}
                            onChange={handleChangeGenre}
                        >
                            {genres.map((genre) => (
                                <option key={genre.value} value={genre.value}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>


                    </div>
                    <div className="productFormMiddle">
                        <label>Content</label>
                        <select
                            multiple
                            value={listData.content}
                            name="content"
                            id="content"
                            onChange={handleChangeContent}
                            style={{ height: '300px',width:'300px' }}
                        >
                            {movies.map((movie) => (
                                <option key={movie._id} value={movie._id}>
                                    {movie.title}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div className="productFormRight">
                        <button className="productButton" onClick={handleSubmit}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}