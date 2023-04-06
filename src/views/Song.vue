<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  doc,
  getDoc,
  collection,
  addDoc,
  where,
  getDocs,
  query,
  updateDoc
} from 'firebase/firestore'
import { db, auth } from '../includes/firebase'
import { useUserStore } from '../stores/user'
import { usePlayerStore } from '../stores/player'

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const player = usePlayerStore()
const song = ref([])
const comments = ref([])
const sort = ref('1')
const comment_in_submission = ref(false)
const comment_show_alert = ref(false)
const comment_alert_variant = ref('bg-blue-500')
const comment_alert_message = ref('Please wait! Your comment is being submitted.')

const commentSchema = {
  comment: 'required|min:5'
}

const sortedComments = computed(() => {
  // here we just want to sort the array but it will directly mutate the array thats why we added slice to create a new array
  return comments.value.slice().sort((a, b) => {
    if (sort.value === '1') {
      return new Date(b.datePost) - new Date(a.datePost)
    }

    return new Date(a.datePost) - new Date(b.datePost)
  })
})

async function addComment(values, { resetForm }) {
  // values and resetForm(should be context but we destructure it) is automatically passed by veevalidate

  comment_in_submission.value = true
  comment_show_alert.value = true
  comment_alert_variant.value = 'bg-blue-500'
  comment_alert_message.value = 'Please wait! Your comment is being submitted.'

  const comment = {
    content: values.comment,
    datePost: new Date().toString(),
    sid: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid
  }

  await addDoc(collection(db, 'comments'), comment)

  song.value.comment_count += 1
  const songRef = doc(db, 'songs', route.params.id)

  await updateDoc(songRef, {
    comment_count: song.value.comment_count
  })
  await getComments()

  comment_in_submission.value = false
  comment_alert_variant.value = 'bg-green-500'
  comment_alert_message.value = 'Comment added!'

  resetForm()
}

async function getComments() {
  const q = query(collection(db, 'comments'), where('sid', '==', route.params.id))
  const querySnapshot = await getDocs(q)

  comments.value = []

  querySnapshot.forEach((doc) => {
    comments.value.push({
      docId: doc.id,
      ...doc.data()
    })
  })
}

watch(sort, (newSortBy) => {
  if (newSortBy === route.query.sortBy) {
    return
  }

  router.push({
    query: {
      sortBy: newSortBy
    }
  })
})

async function getSong() {
  const songRef = doc(db, 'songs', route.params.id)
  const songSnap = await getDoc(songRef)

  if (!songSnap.exists()) {
    router.push({
      name: 'Home'
    })
    return
  }

  const { sortBy } = route.query

  sort.value = sortBy === '1' || sortBy === '2' ? sortBy : '1'

  song.value = songSnap.data()
  getComments()
}
getSong()
</script>

<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    ></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button
        @click.prevent="player.newSong(song)"
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
      >
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section id="comments" class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.comment_count }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div
          class="text-white text-center font-bold p-4 mb-4"
          v-if="comment_show_alert"
          :class="comment_alert_variant"
        >
          {{ comment_alert_message }}
        </div>
        <VeeForm :validation-schema="commentSchema" @submit="addComment" v-if="user.userLoggedIn">
          <VeeField
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></VeeField>
          <ErrorMessage name="comment" class="text-red-600" />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block disabled:bg-gray-500"
            :disabled="comment_in_submission"
          >
            Submit
          </button>
        </VeeForm>
        <!-- Sort Comments -->
        <select
          v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li
      class="p-6 bg-gray-50 border border-gray-200"
      v-for="comment in sortedComments"
      :key="comment.docId"
    >
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePost }}</time>
      </div>

      <p>{{ comment.content }}</p>
    </li>
  </ul>
</template>
