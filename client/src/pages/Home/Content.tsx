import { SubmitHandler, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { GenerateImageDto } from "../../types/requests";
import ImagesList from "../../components/ImagesList/ImagesList";
import { useState } from "react";
import { Size } from "../../types/utils";

function Content() {
  const [requestsArray, setRequestsArray] = useState<Array<GenerateImageDto>>(
    []
  );

  const { register, handleSubmit } = useForm<GenerateImageDto>();
  const onSubmit: SubmitHandler<GenerateImageDto> = (data) => {
    const requestData = { ...data, generateId: uuidv4() };
    setRequestsArray((prevArray) => [...prevArray, requestData]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Generate an Image
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 max-w-lg w-full"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="prompt"
          >
            Prompt
          </label>
          <input
            {...register("prompt")}
            type="text"
            id="prompt"
            placeholder="Enter prompt"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="size"
          >
            Size
          </label>
          <select
            {...register("size")}
            id="size"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value={Size.LARGE}>Large</option>
            <option value={Size.MEDIUM}>Medium</option>
            <option value={Size.SMALL}>Small</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Generate Image
        </button>
      </form>

      <ImagesList requestsArray={requestsArray} />
    </div>
  );
}

export default Content;
