export default defineNuxtRouteMiddleware(async (to) => {
  const { initAuth, isAuthenticated, user } = useAuth()

  await initAuth()

  if (!isAuthenticated.value) {
    const redirect = encodeURIComponent(to.fullPath)
    return navigateTo(`/admin/login?redirect=${redirect}`)
  }

  if (user.value?.role !== 'admin') {
    return navigateTo('/')
  }
})
