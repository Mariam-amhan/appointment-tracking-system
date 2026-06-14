<script setup lang="ts">
import type { AxiosError } from 'axios'

useSeoMeta({
  title: 'Randevu Al | Akilli Randevu ve Takip Sistemi',
  description: 'Secilen hizmet icin randevu olustur.'
})

definePageMeta({
  middleware: 'user'
})

type ServiceItem = {
  id: string
  name: string
  description: string
  durationMinutes: number
  active: boolean
}

type ServicesApiResponse = {
  success: boolean
  message: string
  data: {
    services: ServiceItem[]
  }
}

const route = useRoute()
const api = useApi()

const services = ref<ServiceItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const formState = reactive({
  appointmentAt: '',
  note: ''
})

const serviceId = computed(() => {
  if (typeof route.query.serviceId === 'string') {
    return route.query.serviceId
  }

  return ''
})

const selectedService = computed(() => services.value.find(item => item.id === serviceId.value))

async function loadServices() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<ServicesApiResponse>('/services')
    services.value = response.data.data.services || []
  } catch {
    errorMessage.value = 'Hizmet bilgisi alinamadi.'
  } finally {
    loading.value = false
  }
}

await loadServices()

async function submitAppointment() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!selectedService.value) {
    errorMessage.value = 'Gecerli bir hizmet seciniz.'
    return
  }

  if (!formState.appointmentAt) {
    errorMessage.value = 'Lutfen randevu tarihi ve saatini seciniz.'
    return
  }

  try {
    await api.post('/appointments', {
      serviceId: selectedService.value.id,
      appointmentAt: new Date(formState.appointmentAt).toISOString(),
      note: formState.note
    })

    successMessage.value = 'Randevunuz basariyla olusturuldu.'
    formState.appointmentAt = ''
    formState.note = ''
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Randevu olusturulamadi.'
  }
}
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="mx-auto max-w-2xl">
      <UCard class="border border-slate-200 shadow-sm">
        <template #header>
          <h1 class="text-2xl font-bold text-slate-900">
            Hizmete Randevu Al
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Secilen hizmet icin uygun tarih-saat belirleyin.
          </p>
        </template>

        <div
          v-if="loading"
          class="space-y-3"
        >
          <USkeleton class="h-6 w-56" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-28 w-full" />
        </div>

        <div v-else>
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

          <div
            v-if="selectedService"
            class="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-primary">
              Secilen Hizmet
            </p>
            <h2 class="mt-1 text-lg font-semibold text-slate-900">
              {{ selectedService.name }}
            </h2>
            <p class="mt-1 text-sm text-slate-600">
              {{ selectedService.description || 'Bu hizmet icin aciklama bulunmuyor.' }}
            </p>
            <p class="mt-2 text-sm text-slate-500">
              Sure: {{ selectedService.durationMinutes }} dk
            </p>
          </div>

          <form
            class="space-y-4"
            @submit.prevent="submitAppointment"
          >
            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-700">Randevu Tarihi ve Saati</label>
              <UInput
                v-model="formState.appointmentAt"
                class="w-full"
                type="datetime-local"
                icon="i-material-symbols-event-upcoming-rounded"
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-700">Not (Opsiyonel)</label>
              <UTextarea
                v-model="formState.note"
                class="w-full"
                :rows="4"
                placeholder="Ek notlarinizi buraya yazabilirsiniz"
              />
            </div>

            <UButton
              type="submit"
              block
              label="Randevu Talebini Gonder"
              icon="i-material-symbols-send-rounded"
            />
          </form>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
