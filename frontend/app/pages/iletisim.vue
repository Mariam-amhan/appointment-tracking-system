<script setup lang="ts">
useSeoMeta({
  title: 'Iletisim | Akilli Randevu ve Takip Sistemi',
  description: 'Adres, telefon bilgileri ve iletisim formu ile bize ulasin.'
})

const formState = reactive({
  fullName: '',
  phone: '',
  email: '',
  message: ''
})

const feedback = ref<{ type: 'success' | 'error', message: string } | null>(null)

function submitForm() {
  feedback.value = null

  const hasName = formState.fullName.trim().length > 1
  const hasPhone = formState.phone.trim().length > 6
  const hasEmail = formState.email.includes('@')
  const hasMessage = formState.message.trim().length > 5
  const hasRequiredFields = hasName && hasPhone && hasEmail && hasMessage

  if (!hasRequiredFields) {
    feedback.value = {
      type: 'error',
      message: 'Lutfen tum alanlari gecerli bilgilerle doldurun.'
    }
    return
  }

  feedback.value = {
    type: 'success',
    message: 'Mesajiniz basariyla alindi. En kisa surede size donus saglayacagiz.'
  }

  formState.fullName = ''
  formState.phone = ''
  formState.email = ''
  formState.message = ''
}
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="mb-8 max-w-3xl">
      <p class="text-sm font-semibold text-primary">
        Iletisim
      </p>
      <h1 class="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
        Bize Ulasin
      </h1>
      <p class="mt-3 text-sm leading-6 text-slate-600 md:text-base">
        Sorulariniz, onerileriniz veya is birligi talepleriniz icin asagidaki bilgilerden bize
        ulasabilir ya da iletisim formunu doldurabilirsiniz.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="space-y-4">
        <UCard class="border border-slate-200">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-material-symbols-location-on-rounded"
              class="mt-1 h-5 w-5 text-primary"
            />
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Adres
              </h2>
              <p class="mt-1 text-sm text-slate-600">
                Ataturk Caddesi No:45, Kat:3
              </p>
              <p class="text-sm text-slate-600">
                Kadikoy / Istanbul
              </p>
            </div>
          </div>
        </UCard>

        <UCard class="border border-slate-200">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-material-symbols-call-rounded"
              class="mt-1 h-5 w-5 text-primary"
            />
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                Telefon
              </h2>
              <p class="mt-1 text-sm text-slate-600">
                +90 212 555 10 10
              </p>
              <p class="text-sm text-slate-600">
                +90 530 555 10 10
              </p>
            </div>
          </div>
        </UCard>

        <UCard class="border border-slate-200">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-material-symbols-mail-rounded"
              class="mt-1 h-5 w-5 text-primary"
            />
            <div>
              <h2 class="text-sm font-semibold text-slate-900">
                E-posta ve Calisma Saatleri
              </h2>
              <p class="mt-1 text-sm text-slate-600">
                destek@akillirandevu.com
              </p>
              <p class="text-sm text-slate-600">
                Hafta ici: 09:00 - 18:00
              </p>
              <p class="text-sm text-slate-600">
                Cumartesi: 10:00 - 14:00
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <UCard class="border border-slate-200 shadow-sm">
        <template #header>
          <h2 class="text-lg font-semibold text-slate-900">
            Iletisim Formu
          </h2>
        </template>

        <form
          class="space-y-4"
          @submit.prevent="submitForm"
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
            <label class="text-sm font-medium text-slate-700">Telefon Numarasi</label>
            <UInput
              v-model="formState.phone"
              class="w-full"
              type="tel"
              placeholder="05xx xxx xx xx"
              icon="i-material-symbols-call-rounded"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Email Adresi</label>
            <UInput
              v-model="formState.email"
              class="w-full"
              type="email"
              placeholder="ornek@mail.com"
              icon="i-material-symbols-mail-rounded"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-slate-700">Mesajiniz</label>
            <UTextarea
              v-model="formState.message"
              class="w-full"
              :rows="5"
              placeholder="Mesajinizi buraya yazin"
            />
          </div>

          <UButton
            type="submit"
            block
            label="Gonder"
            icon="i-material-symbols-send-rounded"
          />
        </form>

        <UAlert
          v-if="feedback"
          class="mt-4"
          :color="feedback.type === 'success' ? 'success' : 'error'"
          variant="subtle"
          :icon="feedback.type === 'success' ? 'i-material-symbols-check-circle-rounded' : 'i-material-symbols-error-rounded'"
          :description="feedback.message"
        />
      </UCard>
    </div>
  </UContainer>
</template>
