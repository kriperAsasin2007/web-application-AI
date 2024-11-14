import { GenerateImageDto } from "../../types/requests";
import ImageRow from "./ImageRow";

interface IImagesListProps {
  requestsArray: Array<GenerateImageDto>;
}

function ImagesList({ requestsArray }: IImagesListProps) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Generated Images
      </h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {requestsArray.length > 0 ? (
          requestsArray.map((item) => (
            <ImageRow key={item.generateId} generateImageDto={item} />
          ))
        ) : (
          <p className="text-gray-500">No images have been generated yet.</p>
        )}
      </div>
    </div>
  );
}

export default ImagesList;
