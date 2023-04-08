import SongItem from '@/components/SongItem.vue'
import { RouterLinkStub, shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

describe('Router', () => {
  test('renders router link', () => {
    const song = {
      docId: 'abc'
    }

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          'RouterLink': RouterLinkStub
        }
      }
    })

    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({ name: 'Song', params: { id: song.docId } })
  })
})