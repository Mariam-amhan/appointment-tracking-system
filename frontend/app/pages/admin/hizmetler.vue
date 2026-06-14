<script setup lang="ts">
import type { AxiosError } from 'axios'

definePageMeta({
  middleware: 'admin'
})

useSeoMeta({
  title: 'Hizmetler | Admin Panel',
  description: 'Hizmetleri duzenleyin, aktiflik durumunu yonetin.'
})

type ServiceItem = {
  id: string
  name: string
  description: string
  durationMinutes: number
  active: boolean
}

const api = useApi()

const services = ref<ServiceItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const updatingServiceId = ref<string | null>(null)
const deletingServiceId = ref<string | null>(null)
const editingServiceId = ref<string | null>(null)

const editForm = reactive({
  name: '',
  description: '',
  durationMinutes: 30,
  active: true
})

async function loadServices() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<{ data: { services: ServiceItem[] } }>('/admin/services')
    services.value = response.data.data.services || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Hizmetler yuklenemedi.'
  } finally {
    loading.value = false
  }
}

function replaceService(updatedService: ServiceItem) {
  const index = services.value.findIndex(item => item.id === updatedService.id)
  if (index === -1) {
    return
  }

  services.value[index] = updatedService
}

function startEdit(service: ServiceItem) {
  editingServiceId.value = service.id
  editForm.name = service.name
  editForm.description = service.description
  editForm.durationMinutes = service.durationMinutes
  editForm.active = service.active
}

function cancelEdit() {
  editingServiceId.value = null
}

async function saveEdit() {
  if (!editingServiceId.value) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  updatingServiceId.value = editingServiceId.value

  try {
    const response = await api.patch<{ data: { service: ServiceItem } }>(`/admin/services/${editingServiceId.value}`, {
      name: editForm.name,
      description: editForm.description,
      durationMinutes: Number(editForm.durationMinutes),
      active: editForm.active
    })

    replaceService(response.data.data.service)
    successMessage.value = 'Hizmet basariyla guncellendi.'
    editingServiceId.value = null
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Hizmet guncellenemedi.'
  } finally {
    updatingServiceId.value = null
  }
}

async function deleteService(service: ServiceItem) {
  const confirmed = confirm(`${service.name} hizmetini kalici olarak silmek istediginize emin misiniz?`)
  if (!confirmed) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  deletingServiceId.value = service.id

  try {
    await api.delete(`/admin/services/${service.id}`)
    services.value = services.value.filter(item => item.id !== service.id)
    if (editingServiceId.value === service.id) {
      editingServiceId.value = null
    }
    successMessage.value = 'Hizmet kalici olarak silindi.'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Hizmet silinemedi.'
  } finally {
    deletingServiceId.value = null
  }
}

await loadServices()
</script>

<template>
  <AdminPanelShell
    title="Hizmetler"
    description="Hizmet bilgilerini guncelleyin veya hizmetleri kalici olarak silin."
  >
    <template #header-actions>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-material-symbols-refresh-rounded"
        label="Yenile"
        :loading="loading"
        @click="loadServices()"
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
        <USkeleton class="h-14 w-full" />
        <USkeleton class="h-14 w-full" />
        <USkeleton class="h-14 w-full" />
      </div>

      <div
        v-else-if="services.length === 0"
        class="text-sm text-slate-600"
      >
        Hizmet bulunmuyor.
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="service in services"
          :key="service.id"
          class="rounded-lg border border-slate-200 p-4"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-900">
                {{ service.name }}
              </p>
              <p class="text-xs text-slate-600">
                {{ service.description || 'Aciklama yok' }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <UBadge
                  color="primary"
                  variant="subtle"
                  class="rounded-full"
                >
                  {{ service.durationMinutes }} dk
                </UBadge>
                <UBadge
                  :color="service.active ? 'success' : 'error'"
                  variant="subtle"
                  class="rounded-full"
                >
                  {{ service.active ? 'Aktif' : 'Pasif' }}
                </UBadge>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UButton
                color="neutral"
                variant="outline"
                icon="i-material-symbols-edit-rounded"
                label="Duzenle"
                @click="startEdit(service)"
              />
              <UButton
                color="error"
                variant="soft"
                icon="i-material-symbols-delete-rounded"
                label="Sil"
                :loading="deletingServiceId === service.id"
                @click="deleteService(service)"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <UCard
      v-if="editingServiceId"
      class="mt-5 border border-slate-200 shadow-sm"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-slate-900">
          Hizmet Duzenle
        </h2>
      </template>

      <form
        class="space-y-4"
        @submit.prevent="saveEdit"
      >
        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Hizmet Adi</label>
          <UInput
            v-model="editForm.name"
            class="w-full"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Aciklama</label>
          <UTextarea
            v-model="editForm.description"
            class="w-full"
            :rows="3"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-slate-700">Sure (dakika)</label>
          <UInput
            v-model.number="editForm.durationMinutes"
            class="w-full"
            type="number"
            min="5"
            max="480"
          />
        </div>

        <div class="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
          <USwitch v-model="editForm.active" />
          <p class="text-sm text-slate-700">
            Hizmet aktif olsun
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton
            type="submit"
            :loading="updatingServiceId === editingServiceId"
            icon="i-material-symbols-save-rounded"
            label="Kaydet"
          />
          <UButton
            color="neutral"
            variant="outline"
            icon="i-material-symbols-close-rounded"
            label="Vazgec"
            @click="cancelEdit"
          />
        </div>
      </form>
    </UCard>
  </AdminPanelShell>
</template>
