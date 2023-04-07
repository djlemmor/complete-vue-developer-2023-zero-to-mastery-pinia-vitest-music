import { ref } from 'vue'
import { defineStore } from 'pinia'
import { auth, db } from '@/includes/firebase'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const useUserStore = defineStore('user', () => {
  const userLoggedIn = ref(false)

  async function register(values) {
    const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)

    await setDoc(doc(db, 'users', userCred.user.uid), {
      name: values.name,
      email: values.email,
      age: values.age,
      country: values.country
    })

    await updateProfile(auth.currentUser, { displayName: values.name })

    userLoggedIn.value = true
  }

  async function authenticate(values) {
    await signInWithEmailAndPassword(auth, values.email, values.password)

    userLoggedIn.value = true
  }

  async function logout() {
    await signOut(auth)

    userLoggedIn.value = false
  }

  return { userLoggedIn, register, authenticate, logout }
})
