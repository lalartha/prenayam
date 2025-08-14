// Optional Firebase setup for account-based note sync
// 1) Replace firebaseConfig with your project's keys
// 2) Uncomment the imports and code below
// 3) Use Google sign-in to sync notes to Firestore

/*
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: '...'
  , authDomain: '...'
  , projectId: '...'
  , storageBucket: '...'
  , messagingSenderId: '...'
  , appId: '...'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signinBtn = document.getElementById('signin-btn');
const signoutBtn = document.getElementById('signout-btn');
const userInfo = document.getElementById('user-info');

async function pullNotes(uid) {
  const q = query(collection(db, `users/${uid}/notes`), orderBy('ts', 'desc'));
  const snap = await getDocs(q);
  const notes = [];
  snap.forEach(d => notes.push(d.data()));
  localStorage.setItem('prenayam.notes', JSON.stringify(notes));
}

async function pushNote(uid, note) {
  await addDoc(collection(db, `users/${uid}/notes`), note);
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    signinBtn.style.display = 'none';
    signoutBtn.style.display = '';
    userInfo.textContent = user.displayName || user.email || 'Signed in';
    await pullNotes(user.uid);
    window.renderNotes && window.renderNotes();
  } else {
    signinBtn.style.display = '';
    signoutBtn.style.display = 'none';
    userInfo.textContent = '';
  }
});

signinBtn?.addEventListener('click', async () => {
  await signInWithPopup(auth, provider);
});

signoutBtn?.addEventListener('click', async () => {
  await signOut(auth);
});

// Hook note save to push to cloud when signed in
const originalSave = window.saveLocalNotes;
window.saveLocalNotes = function(notes) {
  originalSave(notes);
  const user = auth.currentUser;
  if (user) {
    const last = notes[0];
    if (last) pushNote(user.uid, last).catch(() => {});
  }
}
*/


