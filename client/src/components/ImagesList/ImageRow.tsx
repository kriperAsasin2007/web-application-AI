import { useEffect, useState } from "react";
import { GenerateImageDto } from "../../types/requests";
import CircularLoading from "../CircularLoading/CircularLoading";
import CircularProgressWithLabel from "../CircularProgressWithLabel/CircularProgressWithLabel";
import { longOperaion } from "../../api/longOperation";
import { cancel } from "../../api/images/cancel";
import { generateImages } from "../../api/images";

interface IImageRowProps {
  generateImageDto: GenerateImageDto;
}

function ImageRow({ generateImageDto }: IImageRowProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const handleCancel = async () => {
    await cancel(generateImageDto.generateId);
    setIsLoading(false);
  };

  useEffect(() => {
    const generate = async () => {
      try {
        const result = await generateImages(generateImageDto);
        setImageUrl(result.imageUrl);
      } catch (error) {}
      //  finally {
      //   setIsLoading(false);
      // }
    };

    generate();
  }, []);

  return (
    <div className="flex flex-col items-start p-4 bg-white shadow-md rounded-lg border border-gray-200 mb-4 w-100 border-solid border-l">
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-semibold text-gray-800">
          {generateImageDto.prompt}
        </span>
        {isLoading && (
          <button
            onClick={handleCancel}
            className="ml-4 text-gray-600 hover:text-red-600 transition-colors duration-200"
            title="Cancel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center w-full h-48 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <CircularLoading />
            <span className="mt-2 text-sm text-gray-500">
              Generating image...
            </span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500">Cancelled</span>
        )}
      </div>

      {/* Uncomment if you want to show progress */}
      {/* <CircularProgressWithLabel value={50} /> */}
    </div>
  );
}

export default ImageRow;
