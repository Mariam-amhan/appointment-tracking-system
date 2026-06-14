<script setup lang="ts">
import type { AxiosError } from 'axios'

definePageMeta({
  middleware: 'admin'
})

useSeoMeta({
  title: 'Hizmet Ekle | Admin Panel',
  description: 'Yeni hizmet olusturun ve aktiflik durumunu yonetin.'
})

const api = useApi()

const formState = reactive({
  name: '',
  description: '',
  durationMinutes: 30,
  active: true
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function resetForm() {
  formState.name = ''
  formState.description = ''
  formState.durationMinutes = 30
  formState.active = true
}

async function submitService() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api.post('/admin/services', {
      name: formState.name,
      description: formState.description,
      durationMinutes: Number(formState.durationMinutes),
      active: formState.active
    })

    successMessage.value = 'Hizmet basariyla eklendi.'
    resetForm()
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Hizmet ekleme basarisiz oldu.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminPanelShell
    title="Hizmet Ekle"
    description="Sisteme yeni bir hizmet tanimlayin."
  >
    <UCard class="border border-slate-200 shadow-sm">
      <form
        class="space-y-4"
        @submit.prevent="submitService"
      >
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Hizmet Adi</label>
          <UInput
            v-model="formState.name"
            class="w-full"
            placeholder="Ornek: Cilt Bakimi"
            icon="i-material-symbols-medical-services-rounded"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Aciklama</label>
          <UTextarea
            v-model="formState.description"
            class="w-full"
            :rows="4"
            placeholder="Hizmet ile ilgili kisa aciklama"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Sure (dakika)</label>
          <UInput
            v-model.number="formState.durationMinutes"
            class="w-full"
            type="number"
            min="5"
            max="480"
            icon="i-material-symbols-timer-rounded"
          />
        </div>

        <div class="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
          <USwitch v-model="formState.active" />
          <p class="text-sm text-slate-700">
            Hizmet aktif olsun
          </p>
        </div>

        <UButton
          type="submit"
          :loading="loading"
          icon="i-material-symbols-add-circle-rounded"
          label="Hizmeti Ekle"
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

      <UAlert
        v-if="successMessage"
        class="mt-4"
        color="success"
        variant="subtle"
        icon="i-material-symbols-check-circle-rounded"
        :description="successMessage"
      />
    </UCard>
  </AdminPanelShell>
</template>
