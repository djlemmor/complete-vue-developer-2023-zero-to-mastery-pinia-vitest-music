import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

describe('SongItem.vue', () => {
  test('renders song.display_name', () => {
    const song = {
      display_name: 'test'
    }

    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'RouterLink': RouterLinkStub
        }
      }
    })

    expect(wrapper.text()).toContain(song.display_name)
  })

  test('renders song.display_name inside class text-gray-500', () => {
    const song = {
      display_name: 'test'
    }

    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'RouterLink': RouterLinkStub
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500')

    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  test('renders song.docId in id attribute', () => {
    const song = {
      docId: 'abc'
    }

    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'RouterLink': RouterLinkStub
        }
      }
    })

    expect(wrapper.attributes().id).toBe(`song-id-${song.docId}`)
  })

  test('renders song.docId in class attribute', () => {
    const song = {
      docId: 'abc'
    }

    const wrapper = shallowMount(SongItem, {
      propsData: {
        song
      },
      global: {
        components: {
          'RouterLink': RouterLinkStub
        }
      }
    })

    expect(wrapper.classes()).toContain(`song-id-${song.docId}`)
  })
})