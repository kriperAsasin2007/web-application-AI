import axiosInstance from "../axios";
import { GET_RECORDS_BY_USER_ID_URL } from "./constants";

export const getRecordsByUserId = async () => {
  const response = await axiosInstance.get(GET_RECORDS_BY_USER_ID_URL);
  return response.data;
};
