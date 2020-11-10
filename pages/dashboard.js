import { useCurrentEffect, useGuestList, useGuestPhoto } from "../lib/firebase";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "theme-ui";

export default function Dashboard() {
  const guests = useGuestList();
  const effect = useCurrentEffect();

  if (guests && guests.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>No guests checked in.</h1>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          height: "100%",
          padding: 32,
          display: "grid",
          gap: 32,
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gridTemplateRows: "auto auto auto",
          overflow: "hidden",
        }}
      >
        {guests.map((guest) => (
          <GuestCard key={guest.id} photoId={guest.photoId} dead={guest.dead} />
        ))}
      </div>
      <StaticNoise effect={effect} />
    </>
  );
}

function GuestCard(props) {
  const { photoId, dead } = props;

  const url = useGuestPhoto(photoId);

  const [[randA, randB, randC]] = React.useState(() => [
    rand(120),
    rand(10),
    rand(10),
  ]);

  if (!url) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingTop: "100%",
            position: "absolute",
            opacity: dead ? 0.2 : 1,
            transition: "opacity 4000ms ease-in",
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <img
          src="/blood.svg"
          alt="Blood Smear"
          style={{
            width: "100%",
            position: "absolute",
            top: "8%",
            left: "8%",
            transform: `rotate(${randA}deg) ${
              randC % 2 === 0 ? "scaleX(-1) scaleY(-1)" : ""
            }`,
            opacity: dead ? 1 : 0,
            transition: "opacity 2000ms ease-out",
          }}
        />
        <img
          src="/blood.svg"
          alt="Blood Smear"
          style={{
            width: "100%",
            position: "absolute",
            top: "2%",
            transform: `rotate(${randB}deg) ${
              randC % 2 !== 0 ? " scaleY(-1)" : ""
            }`,
            opacity: dead ? 1 : 0,
            transition: "opacity 2000ms ease-out",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function rand(i) {
  return Math.floor(i + Math.random() * 40);
}

function StaticNoise(props) {
  const { effect } = props;

  const [showStatic, setStatic] = React.useState(false);

  const active = effect.name === "static";

  const soundRef = React.useRef(new window.Audio("/static.mp3"));

  React.useEffect(() => {
    if (active) {
      soundRef.current.play();
      setTimeout(() => effect.clear(), 1000);
    }
  }, [active]);

  const blinkStatic = () => {
    setStatic(true);
    setTimeout(() => {
      setStatic(false);
      setTimeout(blinkStatic, Math.floor(Math.random() * 60) * 1000);
    }, 100);
  };

  React.useEffect(() => {
    blinkStatic();
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        overflow: "hidden",
        opacity: active || showStatic ? 0.9 : 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-500px",
          right: "-500px",
          bottom: "-500px",
          left: "-500px",
          backgroundColor: "rgba(0,0,0,1)",
          backgroundSize: "320px 320px",
          opacity: 0.5,
          animation: "noise 1s infinite both",
          backgroundImage: "url(/noise.png)",
        }}
      />
      <div
        style={{
          content: "",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%,rgba(0,0,0,.75) 100%)",
        }}
      ></div>
    </Box>
  );
}
