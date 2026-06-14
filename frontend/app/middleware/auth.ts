export default defineNuxtRouteMiddleware(async (to) => {
  const { initAuth, isAuthenticated } = useAuth()

  await initAuth()

  if (!isAuthenticated.value) {
    const redirect = encodeURIComponent(to.fullPath)
    return navigateTo(`/login?redirect=${redirect}`)
  }
})
