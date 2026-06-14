<script setup lang="ts">
import type { AxiosError } from 'axios'

definePageMeta({
  middleware: 'user'
})

useSeoMeta({
  title: 'Randevularim | Akilli Randevu ve Takip Sistemi',
  description: 'Aldiginiz randevulari ve durumlarini takip edin.'
})

type AppointmentStatus = 'pending' | 'approved' | 'cancelled'

type AppointmentItem = {
  id: string
  service: string | { name?: string, description?: string } | null
  appointmentAt: string
  status: AppointmentStatus
  note?: string
}

const api = useApi()

const appointments = ref<AppointmentItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const cancellingId = ref<string | null>(null)

async function loadAppointments() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<{ data: { appointments: AppointmentItem[] } }>('/appointments/my')
    appointments.value = response.data.data.appointments || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Randevulariniz yuklenemedi.'
  } finally {
    loading.value = false
  }
}

function getServiceLabel(item: AppointmentItem) {
  if (!item.service) {
    return 'Bilinmeyen hizmet'
  }

  if (typeof item.service === 'string') {
    return item.service
  }

  return item.service.name || 'Bilinmeyen hizmet'
}

function getServiceDescription(item: AppointmentItem) {
  if (!item.service || typeof item.service === 'string') {
    return ''
  }

  return item.service.description || ''
}

function getStatusColor(status: AppointmentStatus): 'warning' | 'success' | 'error' {
  if (status === 'approved') {
    return 'success'
  }

  if (status === 'cancelled') {
    return 'error'
  }

  return 'warning'
}

function getStatusLabel(status: AppointmentStatus) {
  if (status === 'approved') {
    return 'Kabul Edildi'
  }

  if (status === 'cancelled') {
    return 'Reddedildi'
  }

  return 'Onay Bekliyor'
}

function replaceAppointment(nextAppointment: AppointmentItem) {
  const index = appointments.value.findIndex(item => item.id === nextAppointment.id)
  if (index === -1) {
    return
  }

  appointments.value[index] = nextAppointment
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}

async function cancelAppointment(item: AppointmentItem) {
  if (item.status !== 'pending') {
    return
  }

  const confirmed = confirm('Bu randevuyu iptal etmek istediginize emin misiniz?')
  if (!confirmed) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  cancellingId.value = item.id

  try {
    const response = await api.patch<{ data: { appointment: AppointmentItem } }>(`/appointments/${item.id}/cancel`)
    replaceAppointment(response.data.data.appointment)
    successMessage.value = 'Randevunuz iptal edildi.'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Randevu iptal edilemedi.'
  } finally {
    cancellingId.value = null
  }
}

await loadAppointments()
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 md:text-4xl">
          Randevularim
        </h1>
        <p class="mt-2 text-sm text-slate-600 md:text-base">
          Tum randevularinizi ve durumlarini bu ekrandan izleyebilirsiniz.
        </p>
      </div>

      <UButton
        color="neutral"
        variant="outline"
        icon="i-material-symbols-refresh-rounded"
        label="Yenile"
        :loading="loading"
        @click="loadAppointments()"
      />
    </div>

    <UAlert
      v-if="errorMessage"
      class="mb-4"
      color="error"
      variant="subtle"
      icon="i-material-symbols-error-rounded"
      :description="errorMessage"
    />

    <UAlert
      v-if="successMessage"
      class="mb-4"
      color="success"
      variant="subtle"
      icon="i-material-symbols-check-circle-rounded"
      :description="successMessage"
    />

    <UCard class="border border-slate-200 shadow-sm">
      <div
        v-if="loading"
        class="space-y-3"
      >
        <USkeleton class="h-16 w-full" />
        <USkeleton class="h-16 w-full" />
        <USkeleton class="h-16 w-full" />
      </div>

      <div
        v-else-if="appointments.length === 0"
        class="text-sm text-slate-600"
      >
        Henuz randevunuz bulunmuyor.
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="item in appointments"
          :key="item.id"
          class="rounded-lg border border-slate-200 p-4"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">
                {{ getServiceLabel(item) }}
              </p>
              <p
                v-if="getServiceDescription(item)"
                class="text-xs text-slate-600"
              >
                {{ getServiceDescription(item) }}
              </p>
              <p class="mt-1 text-xs text-slate-600">
                {{ formatDateTime(item.appointmentAt) }}
              </p>
              <p
                v-if="item.note"
                class="mt-1 text-xs text-slate-500"
              >
                Not: {{ item.note }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                :color="getStatusColor(item.status)"
                variant="subtle"
                class="rounded-full"
              >
                {{ getStatusLabel(item.status) }}
              </UBadge>

              <UButton
                v-if="item.status === 'pending'"
                color="error"
                variant="soft"
                label="Randevuyu Iptal Et"
                :loading="cancellingId === item.id"
                @click="cancelAppointment(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
