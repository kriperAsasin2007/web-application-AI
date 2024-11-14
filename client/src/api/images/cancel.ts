import axiosInstance from "../axios";
import { CANCEL_URL } from "./constants";

export const cancel = async (generateId: string) => {
  await axiosInstance.post(CANCEL_URL, { generateId });
};
