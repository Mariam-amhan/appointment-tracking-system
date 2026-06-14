export default defineNuxtRouteMiddleware(async (to) => {
  const { initAuth, isAuthenticated, user } = useAuth()

  await initAuth()

  if (!isAuthenticated.value) {
    const redirect = encodeURIComponent(to.fullPath)
    return navigateTo(`/login?redirect=${redirect}`)
  }

  if (user.value?.role !== 'user') {
    return navigateTo('/admin')
  }
})
