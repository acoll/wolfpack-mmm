import React from "react";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import ImageUploader from "../components/ImageUploader";
import { Button } from "theme-ui";
import { useGuest, storage } from "../lib/firebase";
import firebase from "firebase";

export default function CheckIn() {
  const router = useRouter();

  const [characterId] = React.useState(() => nanoid());

  const [photoId, setPhotoId] = React.useState(null);
  const [guestName, setGuestName] = React.useState("");

  const snapshot = useGuest(characterId);

  const waiting = !photoId || !guestName;

  return (
    <div>
      <ImageUploader onRequestSave={setPhotoId} />
      {
        <div
          style={{
            width: "50%",
            margin: "auto",
            display: "grid",
            gridTemplateRows: "auto auto",
            gridTemplateColumns: "1fr",
            gridRowGap: 24,
          }}
        >
          <input
            style={{ width: "100%", padding: "8px 16px", fontSize: 20 }}
            type="text"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            placeholder={`Guest Name`}
          />

          <Button
            style={{
              width: "50%",
              padding: "8px 16px",
              fontSize: 20,
              justifySelf: "center",
              opacity: waiting ? 0.4 : 1,
            }}
            disabled={waiting}
            onClick={(event) => {
              snapshot.ref
                .set({
                  name: guestName,
                  photoId,
                  dead: false,
                  checkedInAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                  router.push("/");
                });
            }}
          >
            {waiting ? "Uploading" : "Save"}
          </Button>
        </div>
      }
    </div>
  );
}
