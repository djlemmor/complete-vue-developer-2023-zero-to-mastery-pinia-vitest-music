import { RouterLinkStub, shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import SongItem from '@/components/SongItem.vue'

describe('Snapshots SongItem.vue', () => {
  test('renders correctly', () => {
    const song = {
      docId: 'abc',
      modified_name: 'test',
      display_name: 'test',
      comment_count: 0
    }

    const wrapper = shallowMount(SongItem, {
      propsData: { song },
      global: {
        components: {
          RouterLink: RouterLinkStub
        }
      }
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
