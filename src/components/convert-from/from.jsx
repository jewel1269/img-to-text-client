import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const URI = import.meta.env.VITE_BASE_URL;
console.log("ImgBB API Key:", API_KEY);
console.log("uri:", URI);

const Form = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [generatedText, setGeneratedText] = useState("");

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
          setGeneratedText(backendResponse?.data?.extractedText);
          console.log(backendResponse.data.extractedText);
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

  const handleCopyText = () => {
    if (generatedText) {
      navigator.clipboard
        .writeText(generatedText)
        .then(() => {
          toast.success("Text copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy text!");
          console.error("Error copying text:", err);
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center w-full max-w-2xl md:max-w-4xl lg:max-w-6xl animate__animated animate__fadeIn">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Free Image to <span className="text-blue-600">Text</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Our image-to-text converter lets you extract text from images in one
          click.
        </p>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          We support JPG, JPEG, PNG, BMP, GIF files.
        </p>

        {/* Image Upload Section */}
        <label
          htmlFor="imageUpload"
          className="mt-6 flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 animate__animated animate__zoomIn"
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded preview"
              className="h-40 md:h-60 lg:h-72 w-auto max-w-full rounded-lg object-contain"
            />
          ) : (
            <>
              <Upload className="text-gray-400" size={40} />
              <span className="text-blue-600 font-medium mt-2">
                Upload Image
              </span>
              <p className="text-gray-400 text-xs md:text-sm">
                Or drop an image
              </p>
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

        {/* Generated Text Display */}
        <div className="mt-6 flex flex-col items-center justify-center lg:h-48 h-[600px]  w-full border-2 border-dashed border-gray-300 rounded-lg lg:p-4 p-1 md:p-6 hover:bg-gray-50 animate__animated animate__fadeInUp">
          <div className="text-sm md:text-base text-gray-700 text-center">
            {imageUrl ? (
              generatedText ? (
                <p>{generatedText}</p>
              ) : (
                "Generating..."
              )
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Copy Text Button */}
        <div className="flex justify-between items-center gap-3 md:justify-between mt-4">
          <h1> ❤️Jewel Mia</h1>
          <button
            className="border px-4 md:px-5 py-2 text-sm md:text-base hover:bg-yellow-500 hover:text-white rounded-2xl transition-all"
            onClick={handleCopyText}
          >
            Copy Text
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Form;
