import { GenerateImageDto } from "../../types/requests";
import axiosInstance from "../axios";
import { GENERATE_IMAGE_URL } from "./constants";

export const generateImages = async (generateImageDto: GenerateImageDto) => {
  const response = await axiosInstance.post(
    GENERATE_IMAGE_URL,
    generateImageDto
  );

  return response.data;
};
