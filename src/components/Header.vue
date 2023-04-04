<script setup>
import { useModalStore } from '../stores/modal'
import { useUserStore } from '../stores/user'

const modal = useModalStore()
const user = useUserStore()

function toggleAuthModal() {
  modal.isOpen = !modal.isOpen
  console.log(modal.isOpen)
}

async function logoutUser() {
  try {
    await user.logout()
  } catch (error) {
    console.log('An error occured while logging out.', error)
    return
  }
}
</script>

<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!user.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <a class="px-2 text-white" href="#">Manage</a>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logoutUser">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
