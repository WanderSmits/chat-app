import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { ref, onUnmounted, computed } from "vue";

firebase.initializeApp({
  apiKey: "AIzaSyDD8XJdxkkWg0bIFB9JwHzxW8V9CclFvZE",
  authDomain: "chatapp-13a17.firebaseapp.com",
  projectId: "chatapp-13a17",
  storageBucket: "chatapp-13a17.appspot.com",
  messagingSenderId: "759566096522",
  appId: "1:759566096522:web:e58ec60bead709a8023573",
});

const auth = firebase.auth();

// useAuth hook
export function useAuth() {
  const user = ref(null);
  const unsubscribe = auth.onAuthStateChanged((_user) => (user.value = _user));
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);
  // Google SignIn popup
  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(googleProvider);
  };
  const signOut = () => auth.signOut();

  return { user, isLogin, signIn, signOut };
}

const firestore = firebase.firestore();
// Add collection messages to firestore
const messagesCollection = firestore.collection("messages");
// Only the most recent 100 messages
const messagesQuery = messagesCollection
  .orderBy("createdAt", "desc")
  .limit(100);

export function useChat() {
  const messages = ref([]);
  // Assign results to all messages
  const unsubscribe = messagesQuery.onSnapshot((snapshot) => {
    messages.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse();
  });
  onUnmounted(unsubscribe);

  const { user, isLogin } = useAuth();
  const sendMessage = (text) => {
    if (!isLogin.value) return;
    const { photoURL, uid, displayName } = user.value;
    messagesCollection.add({
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  return { messages, sendMessage };
}
