import { useRouter } from "next/router";
import ImageUploader from "../../components/ImageUploader";
import { useGuest } from "../../lib/firebase";
import { Button, Flex, Grid } from "theme-ui";

export default function EditGuest() {
  const router = useRouter();
  const { id } = router.query;

  const snapshot = useGuest(id);
  const guest = snapshot?.data();

  if (!guest) {
    return null;
  }

  const initialFiles = guest.photoId
    ? [{ source: guest.photoId, options: { type: "local" } }]
    : [];

  return (
    <div>
      <div style={{ padding: "20px 40px" }}>
        <a href="/">
          <h2>&larr; Go Back</h2>
        </a>
      </div>

      <ImageUploader
        initialFiles={initialFiles}
        onRequestSave={(photoId) => {
          snapshot.ref.update({ photoId });
        }}
      />

      <div
        style={{
          marginTop: 36,
          width: "70%",
          marginLeft: "auto",
          marginRight: "auto",
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "1fr",
          gridRowGap: 24,
        }}
      >
        <input
          style={{ width: "100%", padding: "8px 16px", fontSize: 20 }}
          type="text"
          value={guest.name}
          onChange={(event) =>
            snapshot.ref.update({ name: event.target.value })
          }
          placeholder={`Guest Name`}
        />

        <h2>Status: {guest.dead ? "Dead" : "Alive"}</h2>

        <Grid
          sx={{ gridTemplateColumns: "1fr", gap: "30px", maxWidth: "300px" }}
        >
          <Button
            disabled={guest.dead}
            sx={{ backgroundColor: "purple" }}
            onClick={() => snapshot.ref.update({ dead: true })}
          >
            {"Kill"}
          </Button>

          <Button
            disabled={!guest.dead}
            sx={{ backgroundColor: "green" }}
            onClick={() => snapshot.ref.update({ dead: false })}
          >
            {"Un-Kill"}
          </Button>

          <Button
            sx={{ backgroundColor: "darkred" }}
            onClick={() => {
              snapshot.ref.delete().then(() => router.push("/"));
            }}
          >
            {"Delete"}
          </Button>
        </Grid>
      </div>
    </div>
  );
}
