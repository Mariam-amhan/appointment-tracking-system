<script setup lang="ts">
import type { AxiosError } from 'axios'

useSeoMeta({
  title: 'Kayit Ol | Akilli Randevu ve Takip Sistemi',
  description: 'Yeni hesap olusturarak randevu sistemini kullanmaya baslayin.'
})

const route = useRoute()
const { register, isAuthenticated, user } = useAuth()

const formState = reactive({
  fullName: '',
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

if (isAuthenticated.value) {
  await navigateTo(user.value?.role === 'admin' ? '/admin' : '/')
}

async function submitRegister() {
  loading.value = true
  errorMessage.value = ''

  try {
    await register(formState.fullName, formState.email, formState.password)

    const queryRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    const redirect = queryRedirect.startsWith('/') ? queryRedirect : '/'
    await navigateTo(redirect)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Kayit islemi basarisiz oldu.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="mx-auto max-w-md">
      <UCard class="border border-slate-200 shadow-sm">
        <template #header>
          <h1 class="text-2xl font-bold text-slate-900">
            Kayit Ol
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Hesap olustur ve hizmetler icin randevu talebi gonder.
          </p>
        </template>

        <form
          class="space-y-4"
          @submit.prevent="submitRegister"
        >
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Ad Soyad</label>
            <UInput
              v-model="formState.fullName"
              class="w-full"
              placeholder="Ad Soyad"
              icon="i-material-symbols-person-rounded"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Email</label>
            <UInput
              v-model="formState.email"
              class="w-full"
              type="email"
              placeholder="ornek@mail.com"
              icon="i-material-symbols-mail-rounded"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Sifre</label>
            <UInput
              v-model="formState.password"
              class="w-full"
              type="password"
              placeholder="En az 6 karakter"
              icon="i-material-symbols-lock-rounded"
            />
          </div>

          <UButton
            type="submit"
            block
            :loading="loading"
            label="Kayit Ol"
            icon="i-material-symbols-person-add-rounded"
          />
        </form>

        <UAlert
          v-if="errorMessage"
          class="mt-4"
          color="error"
          variant="subtle"
          icon="i-material-symbols-error-rounded"
          :description="errorMessage"
        />

        <template #footer>
          <p class="text-sm text-slate-600">
            Zaten hesabin var mi?
            <NuxtLink
              to="/login"
              class="font-medium text-primary"
            >
              Giris yap
            </NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
