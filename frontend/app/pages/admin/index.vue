<script setup lang="ts">
import type { AxiosError } from 'axios'

definePageMeta({
  middleware: 'admin'
})

useSeoMeta({
  title: 'Admin Ana Panel | Akilli Randevu ve Takip Sistemi',
  description: 'Kullanici, hizmet ve randevu metriklerini yonetin.'
})

type AppointmentItem = {
  id: string
  status: 'pending' | 'approved' | 'cancelled'
}

type UserItem = {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  active: boolean
}

type ServiceItem = {
  id: string
  name: string
  durationMinutes: number
  active: boolean
}

const api = useApi()

const loading = ref(true)
const errorMessage = ref('')
const appointments = ref<AppointmentItem[]>([])
const users = ref<UserItem[]>([])
const services = ref<ServiceItem[]>([])

const userCount = computed(() => users.value.length)
const serviceCount = computed(() => services.value.length)
const appointmentCount = computed(() => appointments.value.length)
const completedAppointmentCount = computed(() => {
  return appointments.value.filter(item => item.status === 'approved').length
})

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [usersRes, servicesRes, appointmentsRes] = await Promise.all([
      api.get<{ data: { users: UserItem[] } }>('/admin/users'),
      api.get<{ data: { services: ServiceItem[] } }>('/admin/services'),
      api.get<{ data: { appointments: AppointmentItem[] } }>('/admin/appointments')
    ])

    users.value = usersRes.data.data.users || []
    services.value = servicesRes.data.data.services || []
    appointments.value = appointmentsRes.data.data.appointments || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Panel verileri yuklenemedi.'
  } finally {
    loading.value = false
  }
}

await loadDashboard()
</script>

<template>
  <AdminPanelShell
    title="Admin Ana Panel"
    description="Sistemin genel ozetini bu ekrandan takip edebilirsiniz."
  >
    <template #header-actions>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-material-symbols-refresh-rounded"
        label="Yenile"
        :loading="loading"
        @click="loadDashboard()"
      />
    </template>

    <UAlert
      v-if="errorMessage"
      class="mb-5"
      color="error"
      variant="subtle"
      icon="i-material-symbols-error-rounded"
      :description="errorMessage"
    />

    <div
      v-if="loading"
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <USkeleton
        v-for="i in 4"
        :key="i"
        class="h-28 w-full rounded-xl"
      />
    </div>

    <div
      v-else
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <UCard class="border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Kullanici Sayisi
        </p>
        <p class="mt-2 text-3xl font-bold text-slate-900">
          {{ userCount }}
        </p>
      </UCard>

      <UCard class="border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Hizmet Sayisi
        </p>
        <p class="mt-2 text-3xl font-bold text-slate-900">
          {{ serviceCount }}
        </p>
      </UCard>

      <UCard class="border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Randevu Sayisi
        </p>
        <p class="mt-2 text-3xl font-bold text-slate-900">
          {{ appointmentCount }}
        </p>
      </UCard>

      <UCard class="border border-slate-200 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tamamlanan Randevu
        </p>
        <p class="mt-2 text-3xl font-bold text-slate-900">
          {{ completedAppointmentCount }}
        </p>
      </UCard>
    </div>
  </AdminPanelShell>
</template>
