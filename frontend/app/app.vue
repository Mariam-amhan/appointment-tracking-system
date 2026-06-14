<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'tr'
  }
})

const route = useRoute()
const { user, isAuthenticated, logout, initAuth } = useAuth()

await initAuth()

const baseNavItems = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Hizmetlerimiz', to: '/hizmetlerimiz' },
  { label: 'Hakkimizda', to: '/hakkimizda' },
  { label: 'Iletisim', to: '/iletisim' }
]

const navItems = computed(() => {
  if (user.value?.role === 'admin') {
    return [...baseNavItems, { label: 'Admin Panel', to: '/admin' }]
  }

  if (user.value?.role === 'user') {
    return [...baseNavItems, { label: 'Randevularim', to: '/randevularim' }]
  }

  return baseNavItems
})

const mobileMenuItems = computed(() => navItems.value.map(item => ({
  label: item.label,
  to: item.to
})))

const isAdminPanelPage = computed(() => {
  return route.path.startsWith('/admin') && route.path !== '/admin/login'
})

function isActivePath(path: string) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleLogout() {
  logout()
  navigateTo('/')
}
</script>

<template>
  <UApp class="bg-white text-slate-900">
    <UHeader
      v-if="!isAdminPanelPage"
      class="sticky top-0 z-50 border-b border-slate-200  backdrop-blur"
    >
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-material-symbols-calendar-month-rounded"
            class="h-6 w-6 text-primary"
          />
          <span class="text-sm font-semibold md:text-base">Akilli Randevu</span>
        </NuxtLink>
      </template>

      <template #right>
        <div class="hidden items-center gap-1 md:flex">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :label="item.label"
            color="neutral"
            :variant="isActivePath(item.to) ? 'soft' : 'ghost'"
            class="font-medium"
          />
        </div>

        <UDropdownMenu
          :items="mobileMenuItems"
          :content="{ align: 'end' }"
          class="md:hidden"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-material-symbols-menu-rounded"
            aria-label="Menu"
          />
        </UDropdownMenu>

        <div class="hidden items-center gap-2 md:flex">
          <template v-if="isAuthenticated">
            <UButton
              v-if="user?.role === 'admin'"
              to="/admin"
              color="neutral"
              variant="outline"
              icon="i-material-symbols-admin-panel-settings-rounded"
              label="Panel"
            />
            <UBadge
              color="neutral"
              variant="subtle"
              class="rounded-full px-3 py-1"
            >
              {{ user?.fullName }}
            </UBadge>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-material-symbols-logout-rounded"
              label="Cikis"
              @click="handleLogout"
            />
          </template>

          <template v-else>
            <UButton
              to="/login"
              color="neutral"
              variant="outline"
              label="Giris"
              icon="i-material-symbols-login-rounded"
            />
            <UButton
              to="/register"
              label="Kayit Ol"
              icon="i-material-symbols-person-add-rounded"
            />
            <UButton
              to="/admin/login"
              color="neutral"
              variant="ghost"
              label="Admin"
              icon="i-material-symbols-admin-panel-settings-rounded"
            />
          </template>
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator
      v-if="!isAdminPanelPage"
      class="border-slate-200"
    />

    <UFooter
      v-if="!isAdminPanelPage"
      class=""
    >
      <template #left>
        <p class="text-sm text-slate-600">
          (c) {{ new Date().getFullYear() }} Akilli Randevu ve Takip Sistemi
        </p>
      </template>

      <template #right>
        <p class="text-sm text-slate-500">
          Tum haklari saklidir.
        </p>
      </template>
    </UFooter>
  </UApp>
</template>


