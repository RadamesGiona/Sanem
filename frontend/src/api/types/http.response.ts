
// Use this type to define the shape of the response from the API
export type HttpResponse<T> = {
    data: T,
    status: number,
    message: string,
    timestamp: string
}