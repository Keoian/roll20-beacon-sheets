import router from '@/router'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { reactive, ref } from 'vue'

/* Every Character, regardless of sheet, has these meta fields
 * and they must be saved to firebase in this specific way.
 * This store can be reused as-is for any other Vue project.
 * */
export const useMetaStore = defineStore('meta', () => {
  const name = ref('')
  const avatar = ref('')
  const bio = ref('')
  const gmNotes = ref('')
  const campaignId = ref(null)
  const permissions = reactive({
    isOwner: false,
    isGM: false
  })
  // Handles retrieving these values from the store
  const dehydrate = () => {
    return {
      name: name.value,
      avatar: avatar.value,
      bio: bio.value,
      gmNotes: gmNotes.value,
      campaignId: campaignId.value,
      page: router.currentRoute
    }
  }

  // Handles updating these values in the store. `id` and `token` are owned
  // by the Beacon SDK and live at the top level of the character object —
  // read them from `initValues.character` in the relay, not from this store.
  const hydrate = (hydrateStore) => {
    name.value = hydrateStore.name ?? name.value
    avatar.value = hydrateStore.avatar ?? avatar.value
    bio.value = hydrateStore.bio ?? bio.value
    gmNotes.value = hydrateStore.gmNotes ?? gmNotes.value
  }

  return {
    name,
    avatar,
    bio,
    gmNotes,
    permissions,
    campaignId,
    dehydrate,
    hydrate
  }
})


// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMetaStore, import.meta.hot))
}