import firebase from "firebase";
import "firebase/firestore";
import "firebase/storage";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { useDownloadURL } from "react-firebase-hooks/storage";

const config = {
  apiKey: "AIzaSyDrcMTr3LYl2pMkBiCSF8VsUiKN7Hob_5U",
  authDomain: "wolfpack-mmm.firebaseapp.com",
  databaseURL: "https://wolfpack-mmm.firebaseio.com",
  projectId: "wolfpack-mmm",
  storageBucket: "wolfpack-mmm.appspot.com",
  messagingSenderId: "341408271610",
  appId: "1:341408271610:web:fc96ceb1e51075edb40d43",
  measurementId: "G-GQ91X4XVP9",
};

if (process.browser) {
  firebase.initializeApp(config);
}

export const storage = process.browser ? firebase.storage() : null;

export const useGuestList = () => {
  const [results] = useCollection(
    process.browser
      ? firebase.firestore().collection("guests").orderBy("checkedInAt")
      : null
  );

  return results?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];
};

export const useCurrentEffect = () => {
  const [doc] = useDocument(
    process.browser
      ? firebase.firestore().collection("effects").doc("current")
      : null
  );

  return {
    name: doc?.data()?.name,
    clear: () => doc?.ref.update({ name: "" }),
    trigger: (name) => doc?.ref.update({ name }),
  };
};

export const useGuestPhoto = (photoId) => {
  const [url] = useDownloadURL(
    process.browser ? firebase.storage().ref().child(photoId) : null
  );

  return url;
};

export const useGuest = (id) => {
  const [snapshot] = useDocument(
    id && process.browser
      ? firebase.firestore().collection("guests").doc(id)
      : null
  );

  return snapshot;
};
