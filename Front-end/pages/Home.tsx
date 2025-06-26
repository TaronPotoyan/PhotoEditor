import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

export default function ImageEditor() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedEmail = JSON.parse(localStorage.getItem("Picture_editor") || "null");
    if (!storedEmail) {
      setMessage("To edit your photos, please log in or create an account.");
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const imageURL = URL.createObjectURL(file);
      setImageUrls(prev => [imageURL, ...prev]);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleSaveChanges = () => {
    alert(`Saving ${imageUrls.length} image(s)!`);
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Header />
      {message && <span className="pretty-message">{message}</span>}

      <div className="image-uploader">
        <label htmlFor="imageInput">Upload an image from your device:</label>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleImageChange}
          hidden
          ref={fileInputRef}
        />
        <button className="btn" type="button" onClick={handleChooseImage}>
          Choose Image
        </button>
      </div>

      {loading && <span className="image-loader-loading">Loading image...</span>}

      <div className="imagesuser">
        {imageUrls.length === 0 ? (
          <span className="image-loader-placeholder">No images loaded</span>
        ) : (
          imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`User uploaded ${index + 1}`} />
          ))
        )}
      </div>

      {imageUrls.length > 0 && (
        <button className="btn" onClick={handleSaveChanges}>
          Save Changes
        </button>
      )}
    </>
  );
}
