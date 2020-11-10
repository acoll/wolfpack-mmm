import React from "react";
import { Button, Flex, Grid } from "theme-ui";
import { useCurrentEffect } from "../lib/firebase";

const button = (text, onClick) => (
  <Button
    sx={{
      backgroundColor: "rebeccapurple",
      fontWeight: "500",
    }}
    onClick={onClick}
  >
    {text}
  </Button>
);

export default function Effects() {
  const effect = useCurrentEffect();

  return (
    <Grid
      sx={{
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        padding: "60px",
        maxWidth: "800px",
      }}
    >
      {button("Static", () => effect.trigger("static"))}
    </Grid>
  );
}
