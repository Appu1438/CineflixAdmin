import { useState } from "react";
import "./newMovie.css";
import storage from "../../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function NewMovie() {
  const { dispatch } = useContext(MovieContext)
  const navigate = useNavigate()

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
  const [movie, setMovie] = useState(null)
  const [img, setImg] = useState(null)
  const [imgTitle, setImgTitle] = useState(null)
  const [imgSm, setImgSm] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [video, setVideo] = useState(null)
  const [uploaded, setUploaded] = useState(null)

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
  const upload = (items) => {
    

    items.forEach((item) => {
      // Create a reference to the file path in Firebase Storage
      const filename = new Date().getTime() + item.label + item.file.name
      const storageRef = ref(storage, `items/${filename}`);

      // Upload the file with resumable upload
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      // Monitor the upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate the progress as a percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Upload failed:', error);
        },
        () => {
          // Handle successful uploads on completion
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setMovie((prev) => ({ ...prev, [item.label]: downloadURL }));
          });
          setUploaded((prev) => prev + 1);
        }
      );
    });
  };


  const handleUpload = (e) => {
    e.preventDefault()
    upload([
      { file: img, label: 'img' },
      { file: imgTitle, label: 'imgTitle' },
      { file: imgSm, label: 'imgsm' },
      { file: trailer, label: 'trailer' },
      { file: video, label: 'video' },
    ])
  }
  console.log(movie)

  const handleSubmit = (e) => {
    e.preventDefault()
    createMovie(movie, dispatch,navigate)

  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="img" name="img" onChange={e => setImg(e.target.files[0])} />
        </div>
        <div className="addProductItem">
          <label>Title Image</label>
          <input type="file" id="imgTitle" name="imgTitle" onChange={e => setImgTitle(e.target.files[0])} />
        </div>
        <div className="addProductItem">
          <label>Thumbnail Image</label>
          <input type="file" id="imgSm" name="imgSm" onChange={e => setImgSm(e.target.files[0])} />
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
          <input type="file" placeholder="" name="trailer" onChange={e => setTrailer(e.target.files[0])} />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input type="file" placeholder="" name="video" onChange={e => setVideo(e.target.files[0])} />
        </div>
        {uploaded === 5 ?
          (<button className="addProductButton" onClick={handleSubmit}>Create</button>) :
          (<button className="addProductButton" onClick={handleUpload}>Upload Files</button>)}
      </form >
    </div >
  );
}