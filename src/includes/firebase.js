import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDCee9fS7c7vxm2Rp_jh_BZP595dO291Rk',
  authDomain: 'music-21ad5.firebaseapp.com',
  projectId: 'music-21ad5',
  storageBucket: 'music-21ad5.appspot.com',
  messagingSenderId: '566019636791',
  appId: '1:566019636791:web:8a6342a1eff87fc6c5c9b2'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
