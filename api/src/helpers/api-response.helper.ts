import { IApiResponse } from "../interfaces/api-response.interface";

export abstract class ResponseHelper {

  static ok<T>(data: T, message: string = "success"): IApiResponse<T> {
    return {
      message: message,
      data: data,
      status: 200,
      success: true,
    };
  }

  static created<T>(data: T, message: string = "success"): IApiResponse<T> {
    return {
      message: message,
      data: data,
      status: 201,
      success: true,
    };
  }

  static notFound(message: string = "not found"): IApiResponse {
    return {
      message: message,
      status: 404,
      success: false,
    };
  }

  static badRequest(message: string = "bad request"): IApiResponse {
    return {
      message: message,
      status: 400,
      success: false,
    };
  }

}
