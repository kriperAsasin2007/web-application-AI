import { Size, Status } from "../utils";

export class GetRecordsByUserIdResponse {
  id: string;
  promptText: string;
  generatedImageUrl: string;
  createdAt: Date;
  canceledAt?: Date;
  status: Status;
  size: Size;

  constructor(
    id: string,
    promptText: string,
    generatedImageUrl: string,
    createdAt: Date,
    status: Status,
    size: Size,
    canceledAt?: Date
  ) {
    this.id = id;
    this.promptText = promptText;
    this.generatedImageUrl = generatedImageUrl;
    this.createdAt = createdAt;
    this.status = status;
    this.size = size;
    this.canceledAt = canceledAt;
  }
}
