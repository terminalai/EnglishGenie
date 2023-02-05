/** @jsxImportSource @emotion/react */

import { AppBar, css, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

function BasePage(props: { children?: React.ReactNode }) {
  const [currentStyle, setCurrentStyle] = useState(0);
  useEffect(() => {
    setCurrentStyle(1);
  }, []);

  const initialStyle = css({
    transform: "translateY(-100%)",
  });

  const defaultStyle = css({
    transform: "translateY(0px)",
    transition: "transform 500ms ease-out",
  });

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#37474f" }}
        css={[initialStyle, defaultStyle][currentStyle]}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            English Genie
          </Typography>
        </Toolbar>
      </AppBar>

      {props.children}
    </>
  );
}

export default BasePage;
