import axios, { type AxiosInstance } from 'axios'

export function useApi(): AxiosInstance {
  const config = useRuntimeConfig()
  const token = useState<string | null>('auth_token', () => null)

  const instance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  instance.interceptors.request.use((requestConfig) => {
    if (token.value) {
      requestConfig.headers.Authorization = `Bearer ${token.value}`
    }

    return requestConfig
  })

  return instance
}
