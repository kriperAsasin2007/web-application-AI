import { GenerateImageDto } from "../types/requests";
import axiosInstance from "./axios";

export const longOperaion = async (generateImageDto: GenerateImageDto) => {
  const response = await axiosInstance.post(
    "/images/long-operation",
    generateImageDto
  );
  return response.data;
};
