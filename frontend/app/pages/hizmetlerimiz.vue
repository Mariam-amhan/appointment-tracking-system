<script setup lang="ts">
import type { AxiosError } from 'axios'

useSeoMeta({
  title: 'Hizmetlerimiz | Akilli Randevu ve Takip Sistemi',
  description: 'Tum hizmetlerimizi inceleyin ve size uygun randevuyu secin.'
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

const api = useApi()
const { isAuthenticated, user } = useAuth()

const services = ref<ServiceItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

async function loadServices() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<ServicesApiResponse>('/services')
    services.value = response.data.data.services || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Hizmetler alinamadi.'
  } finally {
    loading.value = false
  }
}

function goBooking(serviceId: string) {
  if (isAuthenticated.value && user.value?.role === 'user') {
    navigateTo(`/randevu-al?serviceId=${serviceId}`)
    return
  }

  if (isAuthenticated.value && user.value?.role === 'admin') {
    navigateTo('/admin')
    return
  }

  navigateTo(`/login?redirect=${encodeURIComponent(`/randevu-al?serviceId=${serviceId}`)}`)
}

await loadServices()
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold text-primary">
          Hizmetlerimiz
        </p>
        <h1 class="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
          Tum Hizmetler
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          Asagidaki tum aktif hizmetlerden size uygun olan secenegi belirleyip randevu talebi
          olusturabilirsiniz.
        </p>
      </div>

      <UButton
        color="neutral"
        variant="outline"
        icon="i-material-symbols-refresh-rounded"
        label="Yenile"
        @click="loadServices()"
      />
    </div>

    <div
      v-if="loading"
      class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      <UCard
        v-for="i in 6"
        :key="i"
        class="border border-slate-200"
      >
        <USkeleton class="h-6 w-32" />
        <USkeleton class="mt-4 h-4 w-full" />
        <USkeleton class="mt-2 h-4 w-4/5" />
        <USkeleton class="mt-6 h-9 w-28" />
      </UCard>
    </div>

    <UAlert
      v-else-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-material-symbols-error-rounded"
      title="Hizmetler alinamadi"
      :description="errorMessage"
    />

    <UAlert
      v-else-if="services.length === 0"
      color="neutral"
      variant="subtle"
      icon="i-material-symbols-inbox-rounded"
      title="Su an listelenecek hizmet bulunmuyor"
      description="Yeni hizmetler eklendiginde burada gosterilecek."
    />

    <div
      v-else
      class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      <UCard
        v-for="service in services"
        :key="service.id"
        class="border border-slate-200 shadow-sm"
      >
        <template #header>
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-base font-semibold text-slate-900 md:text-lg">
                {{ service.name }}
              </h3>
              <p class="mt-1 text-xs text-slate-500">
                Hizmet Kodu: {{ service.id }}
              </p>
            </div>

            <UBadge
              color="primary"
              variant="subtle"
              class="rounded-full"
            >
              {{ service.durationMinutes }} dk
            </UBadge>
          </div>
        </template>

        <p class="text-sm leading-6 text-slate-600">
          {{ service.description || 'Bu hizmet icin aciklama yakinda eklenecektir.' }}
        </p>

        <template #footer>
          <UButton
            block
            icon="i-material-symbols-event-available-rounded"
            label="Hizmete Randevu Al"
            @click="goBooking(service.id)"
          />
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
