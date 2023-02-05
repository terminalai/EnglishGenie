/** @jsxImportSource @emotion/react */

import { Delete, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  css,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

function QuestionCard(props: {
  number: number;
  doUnmount: (number: number) => void;
  id: number;
  listTransitioning: number;
  setListTransitioning: (value: number) => void;
  passageContent: string;
  initialContent: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [allowAnswers, setAllowAnswers] = useState(false);
  const [allowCheck, setAllowCheck] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<[string, number, number]>(["", 0, 0]);

  const questionRef = useRef<HTMLInputElement>();
  const answerRef = useRef<HTMLInputElement>();
  function onDelete() {
    props.setListTransitioning(props.listTransitioning + 1);
    setCurrentStyle(2);
  }

  function onTransitionEnd() {
    if (currentStyle === 2)
      setTimeout(() => {
        props.setListTransitioning(props.listTransitioning - 1);
        props.doUnmount(props.id);
      }, 50);
  }

  const [currentStyle, setCurrentStyle] = useState(0);
  useEffect(() => {
    setCurrentStyle(1);
  }, []);

  const enterClass = css({
    transform: "translateX(20%)",
    opacity: 0,
  });
  const defaultClass = css({
    transform: "translateX(0px)",
    opacity: 1,
    transition: "transform 250ms ease-out, opacity 250ms ease-out",
  });

  const exitAnim = css({
    transform: "translateX(20%)",
    opacity: 0,
    transition: "transform 250ms ease-in, opacity 250ms ease-in",
  });

  const listChangeAnim = css({
    opacity: 0.1,
  });

  const listNumberLabelStyle = css`
    ${props.listTransitioning > 0 && listChangeAnim};
    transition: opacity 250ms ease-in-out;
  `;

  useEffect(() => {
    if (questionRef.current) questionRef.current.value = props.initialContent;
    if (props.initialContent.trim().length > 0) setAllowAnswers(true);
  }, []);

  // const checkQuestionAnim = css({
  //   transform: "scale(1, 1)",
  //   opacity: 1,
  // })

  // const checkQuestionStyle = css`
  //   transform: scale(0, 1);
  //   opacity: 0;
  //   transition: transform 250ms ease-in-out, opacity 100ms ease-in-out;
  //   ${allowCheck && checkQuestionAnim};
  // `

  async function checkAnswer() {
    if (!questionRef.current || !answerRef.current) return;
    const question = questionRef.current.value;
    const answer = answerRef.current.value;

    const aiAnswer = await axios.get("http://localhost:5000/answer", {params: {question, passage: props.passageContent}})
    console.log(aiAnswer)

    const grammarScore = await axios.get("http://localhost:5000/grammar", {params: {text: answer}})
    console.log(grammarScore)

    const similarity = await axios.get("http://localhost:5000/similarity", {params: {userText: answer, answerText: aiAnswer.data.answer}})
  }

  return (
    <Collapse in={currentStyle === 1}>
      <Card
        raised
        sx={{
          marginLeft: 2,
          marginRight: 2,
          marginTop: 1,
          marginBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
          display: "flex",
          flexFlow: "row",
          flexWrap: "wrap",
          backgroundColor: "#1b1b1b",
        }}
        css={css`
          ${[enterClass, defaultClass, exitAnim][currentStyle]};
        `}
        onTransitionEnd={onTransitionEnd}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            <i>
              Question <i css={listNumberLabelStyle}>{props.number}</i>
            </i>
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={() => setExpanded(!expanded)}>
            <ExpandMore
              sx={{
                transition: "rotate 150ms ease-in-out",
                rotate: expanded ? "0deg" : "180deg",
              }}
            />
          </IconButton>
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        </CardActions>
        <Box sx={{ flexBasis: "100%" }}></Box>
        <Collapse in={expanded} sx={{ flexGrow: 1 }}>
          <CardContent>
            <TextField
              id="outlined-textarea"
              multiline
              placeholder="Enter question here..."
              inputRef={questionRef}
              fullWidth
              onChange={(e) => {
                setAllowAnswers(e.target.value.trim().length > 0);
              }}
            />
            <Collapse in={allowAnswers}>
              <Box
                sx={{
                  display: "flex",
                  flexFlow: "row",
                  mt: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{ flexGrow: 1 }}
                  id="outlined-textarea"
                  multiline
                  inputRef={answerRef}
                  placeholder="What's your answer?"
                  fullWidth
                  onChange={(e) => {
                    setAllowCheck(e.target.value.trim().length > 0);
                  }}
                />
                <Collapse in={allowCheck} orientation="horizontal">
                  <Button sx={{ ml: 2 }} variant="contained" onClick={checkAnswer}>
                    Check
                  </Button>
                </Collapse>
              </Box>
              <Collapse in={aiAnswer[0].trim().length > 0}>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  AI Answer: {aiAnswer[0]}<br />
                  Your Grammar Score: {aiAnswer[1]}<br />
                  Your Similarity Score: {aiAnswer[2]}
                </Typography>
              </Collapse>
            </Collapse>
          </CardContent>
        </Collapse>
      </Card>
    </Collapse>
  );
}

export default QuestionCard;
