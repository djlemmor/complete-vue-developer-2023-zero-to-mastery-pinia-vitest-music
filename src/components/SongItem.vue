<script setup>
const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
    :class="`song-id-${props.song.docId}`"
    :id="`song-id-${props.song.docId}`"
  >
    <div>
      <RouterLink
        :to="{ name: 'Song', params: { id: props.song.docId } }"
        class="font-bold block text-gray-600 composition-name"
        >{{ props.song.modified_name }}</RouterLink
      >
      <span class="text-gray-500 text-sm">{{ props.song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <RouterLink
        custom
        :to="{ name: 'Song', params: { id: props.song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ props.song.comment_count }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>
