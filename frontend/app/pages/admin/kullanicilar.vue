<script setup lang="ts">
import type { AxiosError } from 'axios'
import type { AuthUser } from '~/composables/useAuth'

definePageMeta({
  middleware: 'admin'
})

useSeoMeta({
  title: 'Kullanicilar | Admin Panel',
  description: 'Kullanicilari listeleyin, rollerini ve durumlarini yonetin.'
})

type UserItem = AuthUser

const api = useApi()
const { user: currentUser } = useAuth()

const users = ref<UserItem[]>([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const updatingRoleFor = ref<string | null>(null)
const deletingUserId = ref<string | null>(null)

async function loadUsers() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.get<{ data: { users: UserItem[] } }>('/admin/users')
    users.value = response.data.data.users || []
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Kullanicilar yuklenemedi.'
  } finally {
    loading.value = false
  }
}

function replaceUser(nextUser: UserItem) {
  const index = users.value.findIndex(item => item.id === nextUser.id)
  if (index === -1) {
    return
  }

  users.value[index] = nextUser
}

async function changeRole(targetUser: UserItem, nextRole: 'user' | 'admin') {
  successMessage.value = ''
  errorMessage.value = ''
  updatingRoleFor.value = targetUser.id

  try {
    const response = await api.patch<{ data: { user: UserItem } }>(`/admin/users/${targetUser.id}/role`, {
      role: nextRole
    })

    replaceUser(response.data.data.user)
    successMessage.value = 'Kullanici rolu basariyla guncellendi.'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Rol guncellenemedi.'
  } finally {
    updatingRoleFor.value = null
  }
}

async function deleteUser(targetUser: UserItem) {
  const confirmed = confirm(`${targetUser.fullName} kullanicisini kalici olarak silmek istediginize emin misiniz?`)
  if (!confirmed) {
    return
  }

  successMessage.value = ''
  errorMessage.value = ''
  deletingUserId.value = targetUser.id

  try {
    await api.delete(`/admin/users/${targetUser.id}`)
    users.value = users.value.filter(item => item.id !== targetUser.id)
    successMessage.value = 'Kullanici kalici olarak silindi.'
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Kullanici silinemedi.'
  } finally {
    deletingUserId.value = null
  }
}

function canEditRole(targetUser: UserItem) {
  return targetUser.id !== currentUser.value?.id
}

function canDeleteUser(targetUser: UserItem) {
  return targetUser.id !== currentUser.value?.id
}

await loadUsers()
</script>

<template>
  <AdminPanelShell
    title="Kullanicilar"
    description="Kullanici rollerini degistirebilir ve kullanicilari kalici olarak silebilirsiniz."
  >
    <template #header-actions>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-material-symbols-refresh-rounded"
        label="Yenile"
        :loading="loading"
        @click="loadUsers()"
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
        <USkeleton class="h-12 w-full" />
        <USkeleton class="h-12 w-full" />
        <USkeleton class="h-12 w-full" />
      </div>

      <div
        v-else-if="users.length === 0"
        class="text-sm text-slate-600"
      >
        Goruntulenecek kullanici bulunmuyor.
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <div
          v-for="account in users"
          :key="account.id"
          class="rounded-lg border border-slate-200 p-4"
        >
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900">
                {{ account.fullName }}
              </p>
              <p class="text-xs text-slate-600">
                {{ account.email }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-2">
                <UBadge
                  color="neutral"
                  variant="subtle"
                  class="rounded-full capitalize"
                >
                  {{ account.role }}
                </UBadge>
                <UBadge
                  :color="account.active ? 'success' : 'error'"
                  variant="subtle"
                  class="rounded-full"
                >
                  {{ account.active ? 'Aktif' : 'Pasif' }}
                </UBadge>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UButton
                :label="account.role === 'admin' ? 'Kullanici Yap' : 'Admin Yap'"
                icon="i-material-symbols-admin-panel-settings-rounded"
                color="neutral"
                variant="outline"
                :loading="updatingRoleFor === account.id"
                :disabled="!canEditRole(account)"
                @click="changeRole(account, account.role === 'admin' ? 'user' : 'admin')"
              />

              <UButton
                label="Sil"
                icon="i-material-symbols-delete-rounded"
                color="error"
                variant="soft"
                :loading="deletingUserId === account.id"
                :disabled="!canDeleteUser(account)"
                @click="deleteUser(account)"
              />
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </AdminPanelShell>
</template>
