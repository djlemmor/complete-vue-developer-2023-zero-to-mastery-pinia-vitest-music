<script setup>
import { ref } from 'vue'
import { auth, db } from '../includes/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { onBeforeRouteLeave } from 'vue-router'
import Upload from '../components/Upload.vue'
import CompositionItem from '../components/CompositionItem.vue'

const songs = ref([])
const unsavedFlag = ref(false)

function updateSong(i, values) {
  songs.value[i].modified_name = values.modified_name
  songs.value[i].genre = values.genre
}

function removeSong(i) {
  songs.value.splice(i, 1)
}

function addSong(doc) {
  const song = {
    docId: doc.id,
    ...doc.data()
  }

  songs.value.push(song)
}

function updateUnsavedFlag(value) {
  unsavedFlag.value = value
}

async function getSongs() {
  const q = query(collection(db, 'songs'), where('uid', '==', auth.currentUser.uid))

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => addSong(doc))
}
getSongs()

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next()
  } else {
    const leave = confirm('You have unsaved changes. Are you sure you want to leave?')
    next(leave)
  }
})
</script>

<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <Upload :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.my_songs') }}</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <CompositionItem
              v-for="(song, index) in songs"
              :key="song.docId"
              :song="song"
              :index="index"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
