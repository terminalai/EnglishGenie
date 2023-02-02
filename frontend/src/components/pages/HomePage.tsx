/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  css,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import QuestionCard from "../elements/QuestionCard";

function HomePage() {
  const [questionIds, setQuestionIds] = useState(new Array<number>());
  const [lastQuestionId, setLastQuestionId] = useState(0);

  const [passageEmpty, setPassageEmpty] = useState(true);
  const [cardState, setCardState] = useState(0);
  const [listTransitioning, setListTransitioning] = useState(0);

  useEffect(() => {
    if (questionIds.length === 0) {
      setLastQuestionId(0);
      setQuestionIds([]);
    }
  }, [questionIds]);

  useEffect(() => {
    setCardState(1);
  }, []);

  function checkEmpty(event: ChangeEvent<HTMLInputElement>) {
    setPassageEmpty(event.target.value.trim().length === 0);
  }
  function addQuestion() {
    setLastQuestionId(lastQuestionId + 1);
    setQuestionIds([...questionIds, lastQuestionId]);
  }

  function doUnmount(id: number) {
    setQuestionIds(questionIds.filter((questionId) => questionId !== id));
  }

  const initialStyle = css({
    transform: "translateX(10%)",
    opacity: 0,
  });

  const defaultStyle = css({
    transform: "translateX(0px)",
    opacity: 1,
    transition: "transform 500ms ease-out, opacity 500ms ease-out",
  });

  return (
    <Card
      sx={{ m: 3, backgroundColor: "#121212" }}
      css={[initialStyle, defaultStyle][cardState]}
      raised
    >
      <CardContent>
        <Typography variant="h5" sx={{ display: "flex" }}>
          <strong style={{ width: "100%", textAlign: "center" }}>
            Passage
          </strong>
        </Typography>
      </CardContent>
      <CardContent>
        <TextField
          id="outlined-textarea"
          multiline
          placeholder="Enter passage here..."
          rows={10}
          fullWidth
          onChange={checkEmpty}
        />
      </CardContent>
      <Collapse in={!passageEmpty}>
        <CardContent sx={{ display: "flex", alignItems: "baseline" }}>
          <Button variant="contained">Generate Question</Button>
          <Typography sx={{ textSize: "10px", height: "100%" }} ml={3} mr={3}>
            <i>or</i>
          </Typography>
          <Button variant="contained" onClick={addQuestion}>
            Add Question
          </Button>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button
            variant="contained"
            onClick={() => {
              setQuestionIds([]);
              setLastQuestionId(0);
            }}
          >
            Delete All
          </Button>
        </CardContent>

        {questionIds.map((questionId, index) => (
          <QuestionCard
            number={index + 1}
            doUnmount={doUnmount}
            key={questionId}
            id={questionId}
            listTransitioning={listTransitioning}
            setListTransitioning={setListTransitioning}
          />
        ))}
        {questionIds.length > 0 && <Box sx={{ height: 10 }}></Box>}
      </Collapse>
    </Card>
  );
}

export default HomePage;
