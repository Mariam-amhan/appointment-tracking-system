<script setup lang="ts">
useSeoMeta({
  title: 'Hakkimizda | Akilli Randevu ve Takip Sistemi',
  description: 'Biz kimiz, misyonumuz ve vizyonumuz hakkinda bilgi alin.'
})

const values = [
  {
    title: 'Guvenilirlik',
    text: 'Tum sureclerde veri guvenligi, seffaflik ve etik yaklasimi temel aliriz.',
    icon: 'i-material-symbols-verified-user-rounded'
  },
  {
    title: 'Erisilebilirlik',
    text: 'Herkesin ihtiyac duydugu hizmete hizli sekilde ulasabilmesini hedefleriz.',
    icon: 'i-material-symbols-accessibility-new-rounded'
  },
  {
    title: 'Surekli Gelisim',
    text: 'Kullanici geri bildirimleriyle platformu duzenli olarak iyilestiririz.',
    icon: 'i-material-symbols-trending-up-rounded'
  }
]
</script>

<template>
  <UContainer class="py-12 md:py-16">
    <div class="max-w-4xl">
      <p class="text-sm font-semibold text-primary">
        Hakkimizda
      </p>
      <h1 class="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
        Biz Kimiz?
      </h1>
      <p class="mt-4 text-base leading-7 text-slate-600">
        Akilli Randevu ve Takip Sistemi, bireylerin saglik hizmetlerine daha hizli ve duzenli
        erisebilmesi icin gelistirilmis bir dijital platformdur. Amacimiz, randevu surecini tek bir
        merkezde toplayarak kullanicilar ve yoneticiler icin sureci sade, guvenli ve izlenebilir hale
        getirmektir.
      </p>
    </div>

    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <UCard class="border border-slate-200 shadow-sm">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-material-symbols-flag-rounded"
              class="h-6 w-6 text-primary"
            />
            <h2 class="text-lg font-semibold text-slate-900">
              Misyonumuz
            </h2>
          </div>
        </template>

        <p class="text-sm leading-6 text-slate-600">
          Teknolojiyi kullanarak randevu olusturma ve takip sureclerini kolaylastirmak, kullanicilara
          zamandan tasarruf saglamak ve kurumlara operasyonel verimlilik kazandirmak.
        </p>
      </UCard>

      <UCard class="border border-slate-200 shadow-sm">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-material-symbols-lightbulb-rounded"
              class="h-6 w-6 text-primary"
            />
            <h2 class="text-lg font-semibold text-slate-900">
              Vizyonumuz
            </h2>
          </div>
        </template>

        <p class="text-sm leading-6 text-slate-600">
          Saglik hizmeti planlama sureclerinde ulke capinda tercih edilen, guvenilir ve yenilikci bir
          dijital ekosistem olmak.
        </p>
      </UCard>
    </div>

    <div class="mt-10">
      <h2 class="text-2xl font-bold text-slate-900">
        Temel Degerlerimiz
      </h2>

      <div class="mt-5 grid gap-5 md:grid-cols-3">
        <UCard
          v-for="item in values"
          :key="item.title"
          class="border border-slate-200"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <div class="rounded-xl bg-primary/10 p-2">
                <UIcon
                  :name="item.icon"
                  class="h-6 w-6 text-primary"
                />
              </div>
              <h3 class="text-base font-semibold text-slate-900">
                {{ item.title }}
              </h3>
            </div>
          </template>

          <p class="text-sm leading-6 text-slate-600">
            {{ item.text }}
          </p>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
