import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios'
import { logoutUserAPI } from '@/lib/features/auth/authSlice'
import { toast } from 'sonner'

// Variable to hold the injected Redux store
let axiosReduxStore: any

export const injectStore = (mainStore: any) => {
  // console.log('Injecting store:', mainStore)
  axiosReduxStore = mainStore
  // console.log('axiosReduxStore after injection:', axiosReduxStore)
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 60000
})

const refreshToken = async () => {
  const response = await axios.post(
    `${
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/v1/'
    }auth/refresh-token`,
    {},
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    }
  )
  return response.data
}

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

let refreshTokenPromise: Promise<any> | null = null

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    
    if (error?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI())
    }

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    // If error 410 GONE - token expired, need to refresh
    if (error.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
          .then((data) => {
            return data?.accessToken
          })
          .catch((err) => {
            axiosReduxStore.dispatch(logoutUserAPI())
            return Promise.reject(err)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then((accessToken) => {
        return axiosInstance(originalRequest)
      })
    }

    let errorMessage: any = error.message
    if (error.response?.data && (error.response.data as any)?.message) {
      errorMessage = (error.response?.data as any)?.message
    }
    if (error.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance