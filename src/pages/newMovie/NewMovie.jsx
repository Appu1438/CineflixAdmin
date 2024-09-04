import { useEffect, useState } from "react";
import "./newMovie.css";
import storage from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGenres } from "../../api/fetchGenres";

export default function NewMovie() {
  const { dispatch } = useContext(MovieContext)
  const navigate = useNavigate()

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres)
    };
    loadGenres();
}, []);

  const [movie, setMovie] = useState(null)
  const [img, setImg] = useState(null)
  const [imgTitle, setImgTitle] = useState(null)
  const [imgSm, setImgSm] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [video, setVideo] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0); // New state for tracking upload progress

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChangeGenre = (event) => {
    const options = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
    setMovie((prevMovie) => ({ ...prevMovie, genre: options }));

  };

  const handleChange = (e) => {
    const value = e.target.value
    setMovie({ ...movie, [e.target.name]: value })

  }
  const handleImageSelect = (e, setState) => {
    const image = e.target.files[0];
    if (!image) return;

    const filename = new Date().getTime() + image.name;
    const storageRef = ref(storage, `items/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [e.target.name]: progress,
        }));
      },
      (error) => {
        console.error('Upload failed:', error);
        setUploadProgress((prevProgress) => ({
          ...prevProgress,
          [e.target.name]: null,
        }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setMovie((prev) => ({ ...prev, [e.target.name]: downloadURL }));
          setState(downloadURL);
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [e.target.name]: null,
          }));
        });
      }
    );
  };


  console.log(movie)

  const handleSubmit = (e) => {
    e.preventDefault()
    createMovie(movie, dispatch, navigate)

  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">

        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="img" name="img" onChange={(e) => handleImageSelect(e, setImg)} />
          {img && <img src={img} alt="Image Preview" className="imagePreview" />}
          {uploadProgress.img &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.img} max="100"></progress>
              <span>{Math.round(uploadProgress.img)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Title Image</label>
          <input type="file" id="imgTitle" name="imgTitle" onChange={(e) => handleImageSelect(e, setImgTitle)} />
          {imgTitle && <img src={imgTitle} alt="Image Preview" className="imagePreview" />}
          {uploadProgress.imgTitle &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.imgTitle} max="100"></progress>
              <span>{Math.round(uploadProgress.imgTitle)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Thumbnail Image</label>
          <input type="file" id="imgSm" name="imgsm" onChange={(e) => handleImageSelect(e, setImgSm)} />
          {imgSm && <img src={imgSm} alt="Image Preview" className="imagePreview" />}
          {uploadProgress.imgsm &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.imgsm} max="100"></progress>
              <span>{Math.round(uploadProgress.imgsm)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Title</label>
          <input type="text" placeholder="Cold Case" name="title" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input type="text" placeholder="Description" name="desc" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input type="text" placeholder="Year" name="year" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input type="text" placeholder="Duration" name="duration" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input type="text" placeholder="Limit" name="limit" onChange={handleChange} />
        </div>

        <div className="addProductItem">
          <label>Genre</label>
          <select
            multiple
            value={selectedOptions}
            name="genre"
            id="genre"
            onChange={handleChangeGenre}
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="addProductItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange}>
            <option value="">isSeries</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="addProductItem">
          <label>Trailer</label>
          <input type="file" placeholder="" name="trailer" onChange={(e) => handleImageSelect(e, setTrailer)} />
          {trailer && <video src={trailer} autoPlay controls progress alt="Image Preview" className="imagePreview" />}
          {uploadProgress.trailer &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.trailer} max="100"></progress>
              <span>{Math.round(uploadProgress.trailer)}%</span>
            </div>
          }
        </div>

        <div className="addProductItem">
          <label>Video</label>
          <input type="file" placeholder="" name="video" onChange={(e) => handleImageSelect(e, setVideo)} />
          {video && <video src={video} autoPlay controls progress alt="Image Preview" className="imagePreview" />}
          {uploadProgress.video &&
            <div className="progressBarContainer">
              <progress value={uploadProgress.video} max="100"></progress>
              <span>{Math.round(uploadProgress.video)}%</span>
            </div>
          }     
           </div>
           
        <button className="addProductButton" onClick={handleSubmit}>Create</button>
      </form >
    </div >
  );
}