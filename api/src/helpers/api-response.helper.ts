import { IApiResponse } from "../interfaces/api-response.interface";

export abstract class ResponseHelper {

  static ok<T>(data: T, message: string = "Success"): IApiResponse<T> {
    return {
      message: message,
      data: data,
      status: 200,
      success: true,
    };
  }

  static created<T>(data: T, message: string = "Success"): IApiResponse<T> {
    return {
      message: message,
      data: data,
      status: 201,
      success: true,
    };
  }


  static notFound(message: string = "Not Found"): IApiResponse {
    return {
      message: message,
      status: 404,
      success: false,
    };
  }

  static badRequest(message: string = "Bad Request"): IApiResponse {
    return {
      message: message,
      status: 400,
      success: false,
    };
  }

  static unauthorized(message: string = "Unauthorized"): IApiResponse {
    return {
      message: message,
      status: 401,
      success: false,
    };
  }

  static forbidden(message: string = "Forbidden"): IApiResponse {
    return {
      message: message,
      status: 403,
      success: false,
    };
  }

  static internalServerError(message: string = "Interal Server Error"): IApiResponse {
    return {
      message: message,
      status: 500,
      success: false,
    };
  }

}
