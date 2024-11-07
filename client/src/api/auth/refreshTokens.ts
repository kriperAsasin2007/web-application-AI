import axiosInstance from "../axios";
import { REFERSH_TOKENS_URL } from "./constants";

export const refreshTokens = async () => {
  const response = await axiosInstance.post(REFERSH_TOKENS_URL);
  return response.data;
};
