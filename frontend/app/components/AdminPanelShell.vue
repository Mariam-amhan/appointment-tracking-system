<script setup lang="ts">
type AdminNavItem = {
  label: string
  to: string
  icon: string
}

const props = defineProps<{
  title: string
  description: string
}>()

const route = useRoute()
const { user, logout } = useAuth()

const navItems: AdminNavItem[] = [
  {
    label: 'Ana Panel',
    to: '/admin',
    icon: 'i-material-symbols-dashboard-rounded'
  },
  {
    label: 'Kullanicilar',
    to: '/admin/kullanicilar',
    icon: 'i-material-symbols-group-rounded'
  },
  {
    label: 'Hizmet Ekle',
    to: '/admin/hizmet-ekle',
    icon: 'i-material-symbols-add-business-rounded'
  },
  {
    label: 'Hizmetler',
    to: '/admin/hizmetler',
    icon: 'i-material-symbols-medical-services-rounded'
  },
  {
    label: 'Randevu Takip',
    to: '/admin/randevu-takip',
    icon: 'i-material-symbols-event-note-rounded'
  }
]

function isActive(path: string) {
  if (path === '/admin') {
    return route.path === '/admin'
  }

  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleLogout() {
  logout()
  navigateTo('/admin/login')
}
</script>

<template>
  <UContainer class="py-8 md:py-10">
    <div class="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside>
        <UCard class="border border-slate-200 shadow-sm">
          <template #header>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Admin Panel
              </p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ user?.fullName }}
              </p>
            </div>
          </template>

          <div class="space-y-2">
            <UButton
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :label="item.label"
              :icon="item.icon"
              color="neutral"
              block
              :variant="isActive(item.to) ? 'soft' : 'ghost'"
              class="justify-start"
            />
          </div>

          <template #footer>
            <UButton
              color="error"
              variant="soft"
              block
              label="Cikis Yap"
              icon="i-material-symbols-logout-rounded"
              @click="handleLogout"
            />
          </template>
        </UCard>
      </aside>

      <section class="min-w-0">
        <div class="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 md:text-3xl">
              {{ props.title }}
            </h1>
            <p class="mt-1 text-sm text-slate-600 md:text-base">
              {{ props.description }}
            </p>
          </div>
          <slot name="header-actions" />
        </div>

        <slot />
      </section>
    </div>
  </UContainer>
</template>
