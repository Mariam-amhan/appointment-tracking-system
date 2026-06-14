<script setup lang="ts">
import type { AxiosError } from 'axios'

definePageMeta({
  middleware: 'admin'
})

useSeoMeta({
  title: 'Randevu Takip | Admin Panel',
  description: 'Randevu durumlarini onaylayin, iptal edin veya beklemeye alin.'
})

type AppointmentStatus = 'pending' | 'approved' | 'cancelled'

type AppointmentItem = {
  id: string
  user: string | { fullName?: string, email?: string } | null
  service: string | { name?: string } | null
  appointmentAt: string
  status: AppointmentStatus
  note?: string
}

const api = useApi()

const appointments = ref<AppointmentItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const updatingAppointmentId = ref<string | null>(null)
const deletingAppointmentId = ref<string | null>(null)

async function loadAppointments() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<{ data: { appointments: AppointmentItem[] } }>('/admin/appointments')
    appointments.value = response.data.data.appointments || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Randevular yuklenemedi.'
  } finally {
    loading.value = false
  }
}

function getUserLabel(appointment: AppointmentItem) {
  if (!appointment.user) {
    return 'Bilinmeyen kullanici'
  }

  if (typeof appointment.user === 'string') {
    return appointment.user
  }

  return appointment.user.fullName || appointment.user.email || 'Bilinmeyen kullanici'
}

function getServiceLabel(appointment: AppointmentItem) {
  if (!appointment.service) {
    return 'Bilinmeyen hizmet'
  }

  if (typeof appointment.service === 'string') {
    return appointment.service
  }

  return appointment.service.name || 'Bilinmeyen hizmet'
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

async function updateStatus(appointment: AppointmentItem, nextStatus: AppointmentStatus) {
  successMessage.value = ''
  errorMessage.value = ''
  updatingAppointmentId.value = appointment.id

  try {
    const response = await api.patch<{ data: { appointment: AppointmentItem } }>(`/admin/appointments/${appointment.id}/status`, {
      status: nextStatus
    })

    replaceAppointment(response.data.data.appointment)
    successMessage.value = 'Randevu durumu guncellendi.'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Randevu guncellenemedi.'
  } finally {
    updatingAppointmentId.value = null
  }
}

async function deleteAppointment(appointment: AppointmentItem) {
  const confirmed = confirm('Bu randevuyu kalici olarak silmek istediginize emin misiniz?')
  if (!confirmed) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  deletingAppointmentId.value = appointment.id

  try {
    await api.delete(`/admin/appointments/${appointment.id}`)
    appointments.value = appointments.value.filter(item => item.id !== appointment.id)
    successMessage.value = 'Randevu kalici olarak silindi.'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Randevu silinemedi.'
  } finally {
    deletingAppointmentId.value = null
  }
}

await loadAppointments()
</script>

<template>
  <AdminPanelShell
    title="Randevu Takip"
    description="Randevularin durumunu onayla, iptal et veya beklemeye al."
  >
    <template #header-actions>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-material-symbols-refresh-rounded"
        label="Yenile"
        :loading="loading"
        @click="loadAppointments()"
      />
    </template>

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
        Goruntulenecek randevu bulunmuyor.
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="appointment in appointments"
          :key="appointment.id"
          class="rounded-lg border border-slate-200 p-4"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">
                {{ getUserLabel(appointment) }} - {{ getServiceLabel(appointment) }}
              </p>
              <p class="text-xs text-slate-600">
                {{ formatDateTime(appointment.appointmentAt) }}
              </p>
              <p
                v-if="appointment.note"
                class="mt-1 text-xs text-slate-500"
              >
                Not: {{ appointment.note }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UBadge
                :color="getStatusColor(appointment.status)"
                variant="subtle"
                class="rounded-full"
              >
                {{ getStatusLabel(appointment.status) }}
              </UBadge>
              <UButton
                color="success"
                variant="soft"
                label="Onayla"
                :disabled="appointment.status === 'approved'"
                :loading="updatingAppointmentId === appointment.id"
                @click="updateStatus(appointment, 'approved')"
              />
              <UButton
                color="warning"
                variant="soft"
                label="Beklemeye Al"
                :disabled="appointment.status === 'pending'"
                :loading="updatingAppointmentId === appointment.id"
                @click="updateStatus(appointment, 'pending')"
              />
              <UButton
                color="error"
                variant="soft"
                label="Reddet"
                :disabled="appointment.status === 'cancelled'"
                :loading="updatingAppointmentId === appointment.id"
                @click="updateStatus(appointment, 'cancelled')"
              />
              <UButton
                color="error"
                variant="outline"
                icon="i-material-symbols-delete-rounded"
                label="Sil"
                :loading="deletingAppointmentId === appointment.id"
                @click="deleteAppointment(appointment)"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </AdminPanelShell>
</template>
