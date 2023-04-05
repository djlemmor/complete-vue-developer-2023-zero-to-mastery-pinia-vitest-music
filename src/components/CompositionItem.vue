<script setup>
import { ref } from 'vue'
import { db } from '@/includes/firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref as fbStorageRef, getStorage, deleteObject } from 'firebase/storage'

const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  updateSong: {
    type: Function,
    required: true
  },
  removeSong: {
    type: Function,
    required: true
  },
  updateUnsavedFlag: {
    type: Function
  }
})

const songSchema = {
  modified_name: 'required',
  genre: 'alpha_spaces'
}
const in_submission = ref(false)
const show_alert = ref(false)
const alert_variant = ref('bg-blue-500')
const alert_message = ref('Please wait! Updating song info.')

async function edit(values) {
  in_submission.value = true
  show_alert.value = true
  alert_variant.value = 'bg-blue-500'
  alert_message.value = 'Please wait! Updating song info.'

  const songRef = doc(db, 'songs', props.song.docId)

  try {
    await updateDoc(songRef, values)
  } catch (error) {
    in_submission.value = false
    alert_variant.value = 'bg-red-500'
    alert_message.value = 'Something went wrong! Try again later.'
    return
  }

  props.updateSong(props.index, values)
  props.updateUnsavedFlag(false)

  in_submission.value = false
  alert_variant.value = 'bg-green-500'
  alert_message.value = 'Success!'
}

async function deleteSong() {
  const storageRef = getStorage()
  const songsRef = fbStorageRef(storageRef, `songs/${props.song.original_name}`)

  await deleteObject(songsRef)
  await deleteDoc(doc(db, 'songs', props.song.docId))

  props.removeSong(props.index)
}

const showForm = ref(false)
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div class="flex items-center justify-between" v-show="!showForm">
      <h4 class="text-1xl font-bold">{{ song.modified_name }}</h4>
      <div class="flex items-center">
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600"
          @click.prevent="deleteSong"
        >
          <i class="fa fa-times"></i>
        </button>
        <button
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600"
          @click.prevent="showForm = !showForm"
        >
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_message }}
      </div>
      <VeeForm :validation-schema="songSchema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600 disabled:bg-gray-500"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600 disabled:bg-gray-500"
          :disabled="in_submission"
          @click="showForm = false"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>
