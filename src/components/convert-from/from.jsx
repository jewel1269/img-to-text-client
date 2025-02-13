import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const URI = import.meta.env.VITE_BASE_URL;
console.log("ImgBB API Key:", API_KEY);
console.log("uri:", URI);

const Form = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
        console.log("Uploaded Image URL:", data.data.url);

        const backendResponse = await axios.post(`${URI}/api/v1/image-upload`, {
          imgUrl: data.data.url,
        });

        if (backendResponse.data.success) {
          toast.success("Image URL saved successfully ");
        } else {
          toast.error("Failed to save image URL !");
        }
      } else {
        alert("Image upload failed!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-4xl w-full">
        <h1 className="text-2xl font-semibold text-gray-900">
          Free Image to <span className="text-blue-600">Text</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Our image to text converter lets you extract text from images in one
          click.
        </p>
        <p className="text-gray-400 text-sm mt-1">
          We support JPG, JPEG, PNG, BMP, GIF files.
        </p>

        <label
          htmlFor="imageUpload"
          className="mt-6 flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50"
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded preview"
              className="max-h-40 object-contain rounded-lg"
            />
          ) : (
            <>
              <Upload className="text-gray-400" size={40} />
              <span className="text-blue-600 font-medium mt-2">
                Upload Image
              </span>
              <p className="text-gray-400 text-sm">Or drop an image</p>
            </>
          )}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        <div className="mt-6 flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-20 cursor-pointer hover:bg-gray-50">
          <div></div>
        </div>
        <div className="flex justify-end relative -mt-9 mr-2 ">
          <button className="border  px-5 hover:bg-yellow-500 hover:text-white rounded-2xl">
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
