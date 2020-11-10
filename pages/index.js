import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useGuestPhoto, useGuestList } from "../lib/firebase";

const Arrow = () => <span style={{ paddingLeft: 8 }}>&rarr;</span>;

export default function Home() {
  const guests = useGuestList();

  return (
    <div className={styles.container}>
      <Head>
        <title>Murderous Mayhem Masquerade</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Murderous Mayhem Masquerade</h1>

        <p className={styles.description}>An event by Wolfpack™</p>

        <div className={styles.grid}>
          <a href="/check-in" className={styles.card}>
            <h3>
              Check-in Guest <Arrow />
            </h3>
            <p>When a new guest arrives, check them in.</p>
          </a>

          <a href="/dashboard" className={styles.card}>
            <h3>
              Dashboard View <Arrow />
            </h3>
            <p>The dashboard view for showing on a display.</p>
          </a>
        </div>

        <h2 style={{ marginTop: 48 }}>Guests</h2>

        <div className={styles.grid}>
          {guests?.map((guest) => (
            <GuestCard
              key={guest.id}
              id={guest.id}
              photoId={guest.photoId}
              name={guest.name}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function GuestCard(props) {
  const { id, photoId, name } = props;

  const url = useGuestPhoto(photoId);

  if (!url) {
    return null;
  }

  return (
    <a href={`edit-guest/${id}`} className={styles.card}>
      <h3>{name}</h3>
      <img src={url} alt="Photo of Guest" width={300} height={300} />
    </a>
  );
}
