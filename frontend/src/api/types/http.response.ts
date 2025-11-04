export type HttpResponse<T> = {
    data: T,
    status: number,
    message: string,
    timestamp: string
}