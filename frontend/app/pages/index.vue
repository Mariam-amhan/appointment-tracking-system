<script setup lang="ts">
import type { AxiosError } from 'axios'

useSeoMeta({
  title: 'Ana Sayfa | Akilli Randevu ve Takip Sistemi',
  description: 'Online randevu olusturma ve takip sureci icin modern cozum.'
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

const loading = ref(true)
const errorMessage = ref('')
const services = ref<ServiceItem[]>([])

const featuredServices = computed(() => services.value.slice(0, 3))

const quickHighlights = [
  {
    title: '7/24 Hizmetinizdeyiz',
    text: 'Randevularinizi dilediginiz zaman, dilediginiz yerde alabilirsiniz.',
    icon: 'i-material-symbols-schedule-rounded'
  },
  {
    title: 'Guvenli Kayitlar',
    text: 'Verileriniz sifrelenir ve kurumsal duzeyde korunur.',
    icon: 'i-material-symbols-shield-lock-rounded'
  },
  {
    title: 'Uzman Kisiler',
    text: 'Sertifikali uzman agina hizli ve guvenli sekilde erisin.',
    icon: 'i-material-symbols-group-rounded'
  }
]

async function loadServices() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<ServicesApiResponse>('/services')
    services.value = response.data.data.services || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Hizmetler yuklenemedi.'
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
  <div class="bg-white">
    <UContainer class="py-14 md:py-20">
      <div class="mx-auto max-w-4xl text-center">
        <UBadge
          color="primary"
          variant="subtle"
          class="rounded-full px-3 py-1"
        >
          Dijital Randevu Yonetimi
        </UBadge>

        <h1 class="mt-6 text-4xl font-bold tracking-tight text-slate-900  md:text-6xl">
          Saglik hizmetlerine hizli ve guvenli erisim
        </h1>

        <p class="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
          Randevu olusturma, takip ve uzman yonlendirmelerini tek platformdan yonetin.
        </p>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <UButton
            size="xl"
            to="/hizmetlerimiz"
            icon="i-material-symbols-medical-services-rounded"
            label="Tum Hizmetleri Gor"
          />
          <UButton
            size="xl"
            color="neutral"
            variant="outline"
            to="/iletisim"
            icon="i-lucide-contact"
            label="Iletisime Gec"
          />
        </div>
      </div>
    </UContainer>

    <UContainer class="pb-12 md:pb-16">
      <div class="mb-8 flex items-end justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-primary">
            Hizmetlerimiz
          </p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900  md:text-3xl">
            One Cikan Ilk 3 Hizmet
          </h2>
        </div>
      </div>

      <div
        v-if="loading"
        class="grid gap-5 md:grid-cols-3"
      >
        <UCard
          v-for="i in 3"
          :key="i"
          class="border border-slate-200"
        >
          <USkeleton class="h-6 w-40" />
          <USkeleton class="mt-4 h-4 w-full" />
          <USkeleton class="mt-2 h-4 w-4/5" />
          <USkeleton class="mt-6 h-9 w-32" />
        </UCard>
      </div>

      <UAlert
        v-else-if="errorMessage"
        color="error"
        variant="subtle"
        icon="i-material-symbols-error-rounded"
        title="Hizmetler getirilemedi"
        :description="errorMessage"
      />

      <UAlert
        v-else-if="featuredServices.length === 0"
        color="neutral"
        variant="subtle"
        icon="i-material-symbols-inbox-rounded"
        title="Su an gosterilecek hizmet bulunmuyor"
        description="Yeni hizmetler eklendiginde burada listelenecek."
      />

      <div
        v-else
        class="grid gap-5 md:grid-cols-3"
      >
        <UCard
          v-for="service in featuredServices"
          :key="service.id"
          class="border border-slate-200 shadow-sm"
        >
          <template #header>
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-semibold  md:text-lg">
                {{ service.name }}
              </h3>
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

      <div class="mt-8 text-center">
        <UButton
          to="/hizmetlerimiz"
          color="neutral"
          variant="outline"
          icon="i-material-symbols-expand-circle-down-rounded"
          label="Daha Fazla"
        />
      </div>
    </UContainer>

    <UContainer class="pb-16 md:pb-20">
      <div class="mb-8">
        <p class="text-sm font-semibold text-primary">
          Neden Biz?
        </p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900  md:text-3xl">
          Sistemimizin Guclu Yanlari
        </h2>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <UCard
          v-for="item in quickHighlights"
          :key="item.title"
          class="border border-slate-200 shadow-sm"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <div class="rounded-xl bg-primary/10 p-2">
                <UIcon
                  :name="item.icon"
                  class="h-6 w-6 text-primary"
                />
              </div>
              <h3 class="text-base font-semibold ">
                {{ item.title }}
              </h3>
            </div>
          </template>

          <p class="text-sm leading-6 text-slate-600">
            {{ item.text }}
          </p>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
