<script setup>
import { useUserStore } from './stores/user'
import { auth } from '@/includes/firebase'
import Header from '@/components/Header.vue'
import Auth from '@/components/Auth.vue'
import Player from '@/components/Player.vue'

const user = useUserStore()

function isLoggedIn() {
  if (auth.currentUser) {
    user.userLoggedIn = true
  }
}
isLoggedIn()
</script>

<template>
  <Header />

  <RouterView v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <main :key="route.name">
        <component :is="Component" />
      </main>
    </transition>
  </RouterView>

  <Player />

  <Auth />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
