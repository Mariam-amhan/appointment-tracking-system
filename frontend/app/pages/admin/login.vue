<script setup lang="ts">
import type { AxiosError } from 'axios'

useSeoMeta({
  title: 'Admin Giris | Akilli Randevu ve Takip Sistemi',
  description: 'Yonetici paneline erismek icin admin hesabi ile giris yapin.'
})

const route = useRoute()
const { login, logout, isAuthenticated, user } = useAuth()

const formState = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

if (isAuthenticated.value) {
  await navigateTo(user.value?.role === 'admin' ? '/admin' : '/')
}

async function submitLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await login(formState.email, formState.password)

    if (result.data.user.role !== 'admin') {
      logout()
      errorMessage.value = 'Bu ekran sadece admin hesaplari icindir.'
      return
    }

    const queryRedirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    const redirect = queryRedirect.startsWith('/admin') ? queryRedirect : '/admin'
    await navigateTo(redirect)
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Admin giris islemi basarisiz oldu.'
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
            Admin Giris
          </h1>
          <p class="mt-1 text-sm text-slate-600">
            Yonetim paneline erisim icin admin hesabinizla giris yapin.
          </p>
        </template>

        <form
          class="space-y-4"
          @submit.prevent="submitLogin"
        >
          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Email</label>
            <UInput
              v-model="formState.email"
              class="w-full"
              type="email"
              placeholder="admin@mail.com"
              icon="i-material-symbols-mail-rounded"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Sifre</label>
            <UInput
              v-model="formState.password"
              class="w-full"
              type="password"
              placeholder="******"
              icon="i-material-symbols-lock-rounded"
            />
          </div>

          <UButton
            type="submit"
            block
            :loading="loading"
            label="Admin Giris"
            icon="i-material-symbols-admin-panel-settings-rounded"
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
            Kullanici girisi icin
            <NuxtLink
              to="/login"
              class="font-medium text-primary"
            >
              buraya tiklayin
            </NuxtLink>
          </p>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
