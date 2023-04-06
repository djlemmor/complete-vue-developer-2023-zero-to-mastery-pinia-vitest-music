<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useModalStore } from '../stores/modal'
import { useUserStore } from '../stores/user'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const modal = useModalStore()
const user = useUserStore()
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

function toggleAuthModal() {
  modal.isOpen = !modal.isOpen
}

async function logoutUser() {
  try {
    await user.logout()
    if (route.meta.requiresAuth) {
      router.push({ name: 'Home' })
    }
  } catch (error) {
    console.log('An error occured while logging out.', error)
    return
  }
}

function changeLocale() {
  locale.value = locale.value === 'fr' ? 'en' : 'fr'
}

const currentLocale = computed(() => (locale.value === 'fr' ? 'French' : 'English'))
</script>

<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink
        :to="{ name: 'Home' }"
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
        >Music</RouterLink
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <RouterLink :to="{ name: 'About' }" class="px-2 text-white">About</RouterLink>
          </li>
          <!-- Navigation Links -->
          <li v-if="!user.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <RouterLink :to="{ name: 'Manage' }" class="px-2 text-white">Manage</RouterLink>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logoutUser">Logout</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a href="#" class="px-2 text-white" @click.prevent="changeLocale">{{
              currentLocale
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
