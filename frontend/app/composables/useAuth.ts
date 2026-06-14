import type { AxiosError } from 'axios'

export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  active: boolean
  createdAt: string
  updatedAt: string
}

type AuthPayload = {
  user: AuthUser
  token: string
}

type AuthResponse = {
  success: boolean
  message: string
  data: AuthPayload
}

type ProfileResponse = {
  success: boolean
  message: string
  data: {
    user: AuthUser
  }
}

export function useAuth() {
  const api = useApi()

  const token = useState<string | null>('auth_token', () => null)
  const user = useState<AuthUser | null>('auth_user', () => null)
  const initialized = useState<boolean>('auth_initialized', () => false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  function saveSessionToStorage() {
    if (!import.meta.client) {
      return
    }

    if (token.value && user.value) {
      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('auth_user', JSON.stringify(user.value))
    }
  }

  function clearSessionFromStorage() {
    if (!import.meta.client) {
      return
    }

    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function setSession(payload: AuthPayload) {
    token.value = payload.token
    user.value = payload.user
    saveSessionToStorage()
  }

  function logout() {
    token.value = null
    user.value = null
    clearSessionFromStorage()
  }

  async function register(fullName: string, email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password
    })

    setSession(response.data.data)
    return response.data
  }

  async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password
    })

    setSession(response.data.data)
    return response.data
  }

  async function fetchMe() {
    const response = await api.get<ProfileResponse>('/users/me')
    user.value = response.data.data.user
    saveSessionToStorage()
    return response.data
  }

  async function initAuth() {
    if (!import.meta.client) {
      return
    }

    if (initialized.value) {
      return
    }

    initialized.value = true

    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (!savedToken || !savedUser) {
      logout()
      return
    }

    token.value = savedToken

    try {
      user.value = JSON.parse(savedUser) as AuthUser
      await fetchMe()
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        logout()
        return
      }

      logout()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    register,
    login,
    logout,
    fetchMe,
    initAuth
  }
}
