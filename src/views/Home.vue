<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { db } from '../includes/firebase'
import { collection, query, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'
import SongItem from '../components/SongItem.vue'

const songs = ref([])
const maxPerPage = ref(5)
const pendingRequest = ref(false)
const q = ref(null)
const lastVisible = ref(null)

function handleScroll() {
  const { scrollTop, offsetHeight } = document.documentElement
  const { innerHeight } = window
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

  if (bottomOfWindow) {
    getSongs()
  }
}

async function getSongs() {
  if (pendingRequest.value) {
    return
  }

  pendingRequest.value = true

  let documentSnapshots

  if (songs.value.length) {
    q.value = query(
      collection(db, 'songs'),
      orderBy('modified_name'),
      startAfter(lastVisible.value),
      limit(maxPerPage.value)
    )
  } else {
    q.value = query(collection(db, 'songs'), orderBy('modified_name'), limit(maxPerPage.value))
  }

  documentSnapshots = await getDocs(q.value)
  lastVisible.value = documentSnapshots.docs[documentSnapshots.docs.length - 1]

  documentSnapshots.forEach((doc) => {
    songs.value.push({
      docId: doc.id,
      ...doc.data()
    })
  })

  pendingRequest.value = false
}

getSongs()
window.addEventListener('scroll', handleScroll)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">{{ $t('home.discover') }}</h1>
        <p class="w-full mx-auto text-2xl">{{ $t('home.listen') }}</p>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200 flex justify-between">
        <span class="card-title">{{ $t('home.songs') }}</span>
        <!-- Icon -->
        <div v-icon.yellow="'headphones-alt'"></div>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <SongItem v-for="song in songs" :key="song.docId" :song="song" />
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>
