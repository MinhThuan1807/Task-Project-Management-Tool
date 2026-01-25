import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios'
import { logoutUserAPI } from '@/lib/features/auth/authSlice'
import { toast } from 'sonner'

type ReduxStoreLike = {
  dispatch: (action: unknown) => unknown
}

type ApiErrorResponse = {
  message?: string
}

type RefreshTokenResponse = {
  accessToken?: string
}

let axiosReduxStore: ReduxStoreLike | null = null

export const injectStore = (mainStore: ReduxStoreLike) => {
  axiosReduxStore = mainStore
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 60000
})

const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await axios.post<RefreshTokenResponse>(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/'}auth/refresh-token`,
    {},
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }
  )
  return response.data
}

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
)

let refreshTokenPromise: Promise<string | undefined> | null = null

type RetryRequestConfig = AxiosRequestConfig & { _retry?: boolean }

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const originalRequest = error.config as RetryRequestConfig | undefined

    // Nếu không có config request thì reject luôn
    if (!originalRequest) return Promise.reject(error)

    // ✅ 401: logout
    if (status === 401) {
      axiosReduxStore?.dispatch(logoutUserAPI())
    }

    // ✅ 410: token expired -> refresh
    if (status === 410 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
          .then((data) => data.accessToken)
          .catch((err) => {
            axiosReduxStore?.dispatch(logoutUserAPI())
            return Promise.reject(err)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      // Chờ refresh xong rồi gọi lại request cũ
      return refreshTokenPromise.then(() => axiosInstance(originalRequest))
    }

    // ✅ Lấy message lỗi an toàn, không any
    const errorMessage =
      error.response?.data?.message ?? error.message ?? 'Unknown error'

    if (status !== 410) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
