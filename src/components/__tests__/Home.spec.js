import SongItem from '@/components/SongItem.vue'
import Home from '@/views/Home.vue'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Icon from '@/directives/icon'

describe('Home.vue', () => {
  test('renders list of songs', () => {
    const songs = [{}, {}, {}]

    const component = shallowMount(Home, {
      data() {
        return {
          songs
        }
      },
      global: {
        mocks: {
          $t: (message) => message
        },
        directives: {
          icon: Icon
        }
      }
    })

    const items = component.findAllComponents(SongItem)
    console.log('items', items)
    console.log('songs', songs)

    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })
  })
})

// 244 Testing Children Components
