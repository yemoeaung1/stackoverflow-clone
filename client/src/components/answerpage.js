import { AskQuestionButton } from "./button_components";
import { constructTextWithHyperlink, sortResults } from "./search_sort";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AnswerPage({ pageData, handlers }) {
  // console.log("in answer page" + JSON.stringify(pageData));
  // console.log(pageData);
  const [question, setQuestion] = useState(pageData);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setQuestion(pageData);
  }, [pageData]);

  //this gets the answer texts asynchronously only once question is fetched 
  // useEffect(() => {
  //   const fetchAnswers = async (answers) => {
  //     console.log("begin fetching answers");
  //     for(let answerID of answers) {
  //       axios.get(`http://localhost:8000/posts/answer/${answerID}`)
  //       .then((response) => {
  //         console.log(response.data);
  //         setAnswers((prev) => [...prev,response.data])
  //       })
  //       .catch((err) => console.log("Error fetching answers: " + err))
  //     }
  //   }
  //   if (question && question.answers) {
  //     fetchAnswers(question.answers);
  //   }
  //   console.log("finished fetching answers");
  // },[question]);

  useEffect(()=> {
    const fetchAnswers = async (answers) => {
      console.log("begin fetching answers");
      for(let answerID of answers) {
        try {
          const response = await (await axios.get(`http://localhost:8000/posts/answer/${answerID}`))
          let answer = response.data
          setAnswers((prevAnswers) => [...prevAnswers, answer])
        } catch (error) {
          console.log("Error fetching answers:" + error)
        }
      }
    }
    if (question && question.answers) {
      fetchAnswers(question.answers);
    }
    console.log("finished fetching answers");
  },[question]);

  // console.log("Answers: " + JSON.stringify(answers));

  //sends you to answer form 
  const handleAnswerButtonClick = () => {
    handlers[0]("answerform", [question]);
  };

  let ask_date_time_string = getLocaleString(question.ask_date_time);
  let sorted_answers = sortResults("sortanswer", answers);

  // console.log(JSON.stringify(answers));
  return (
    <>
      <div className="upper-content">
        <div className="top-ans-content">
          <span className="ans-stats ans-upper" id="ans-box">
            {answers.length} answer
            {answers.length !== 1 ? "s" : ""}
          </span>
          <span className="ans-upper" id="ans-page-title">
            {question.title}
          </span>
          <span className="ans-upper" id="ans-button-container">
            <div className="btn-ctn">
              <AskQuestionButton handlers={handlers} />
            </div>
          </span>
        </div>
        <div id="bot-ans-content">
          <span className="ans-stats ans-upper" id="view-box">
            {question.views} view{question.views !== 1 ? "s" : ""}
          </span>
          <span className="ans-upper" id="ans-page-description">
            {/* {constructTextWithHyperlink(question.text)} */}
            {question.text && constructTextWithHyperlink(question.text)}
          </span>
          <span className="ans-upper" id="user-date-box">
            <p>
              <span className="user">{question.asked_by}</span>
              <br />
              {showDateMetadata(new Date(ask_date_time_string), " asked")}
            </p>
          </span>
        </div>
      </div>
      {sorted_answers.map((answer) => {
        return <Answer key={answer._id} answer={answer} />;
      })}
      <button
        id="answer-button"
        onClick={handleAnswerButtonClick}
        sid="answer-button"
      >
        Answer Question
      </button>
    </>
  );
}

function Answer({ answer }) {
  // console.log(answer._id);

  let ans_date_time_string = getLocaleString(answer.ans_date_time);
  // console.log(ans_date_time_string);
  return (
    <div className="answer-container">
      <div className="answer-text">
        {" "}
        {answer.text && constructTextWithHyperlink(answer.text)}
      </div>
      <div className="ans-user-and-date">
        <p>
          <span className="user" id="ans-reply-user">
            {answer.ans_by}
          </span>
          {showDateMetadata(new Date(ans_date_time_string), " answered")}
        </p>
        <p></p>
      </div>
    </div>
  );
}

function getLocaleString(isoDateString) {
  const dateObject = new Date(isoDateString);

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };

  const formattedDate = dateObject.toLocaleString("en-US", options);
  return formattedDate;
}

function showDateMetadata(msgDate, type) {
  let currDate = new Date();
  let currStr = type + " ";

  let currTime =
    currDate.getFullYear() +
    currDate.getMonth() / 10 +
    currDate.getDate() / 1000 +
    currDate.getHours() / 100000 +
    currDate.getMinutes() / 10000000 +
    currDate.getSeconds() / 1000000000;
  let msgTime =
    msgDate.getFullYear() +
    msgDate.getMonth() / 10 +
    msgDate.getDate() / 1000 +
    msgDate.getHours() / 100000 +
    msgDate.getMinutes() / 10000000 +
    msgDate.getSeconds() / 1000000000;

  let dateDifference = currTime - msgTime;
  let currVal;

  if (dateDifference < 1) {
    if (dateDifference < 0.001) {
      if (dateDifference < 0.00001) {
        if (dateDifference < 0.0000001) {
          if (dateDifference === 0) currVal = 0;
          else if (currDate.getSeconds() >= msgDate.getSeconds())
            currVal = currDate.getSeconds() - msgDate.getSeconds();
          else currVal = currDate.getSeconds() + (60 - msgDate.getSeconds());
          currStr += `${currVal} second${currVal !== 1 ? "s" : ""} ago`;
        } else {
          if (currDate.getMinutes() > msgDate.getMinutes())
            currVal = currDate.getMinutes() - msgDate.getMinutes();
          else currVal = currDate.getMinutes() + (60 - msgDate.getMinutes());
          if (currDate.getSeconds() < msgDate.getSeconds()) currVal -= 1;
          currStr += `${currVal} minute${currVal !== 1 ? "s" : ""} ago`;
        }
      } else {
        if (currDate.getHours() > msgDate.getHours())
          currVal = currDate.getHours() - msgDate.getHours();
        else currVal = currDate.getHours() + (24 - msgDate.getHours());
        if (
          currDate.getMinutes() < msgDate.getMinutes() ||
          (currDate.getMinutes() === msgDate.getMinutes() &&
            currDate.getSeconds() < msgDate.getSeconds())
        )
          currVal -= 1;
        currStr += `${currVal} hour${currVal !== 1 ? "s" : ""} ago`;
      }
    } else currStr += getDateString(msgDate, type);
  } else currStr += getDateString(msgDate, type, 1);

  return currStr;
}

function getDateString(msgDate, type, year = -1) {
  let dateStr = `${msgDate.toLocaleString("default", {
    month: "short",
  })} ${msgDate.getDate()}`;
  if (year !== -1) dateStr += `, ${msgDate.getFullYear()}`;

  if (type === "answered") dateStr += ", ";
  else dateStr += " at ";

  dateStr += `${msgDate.getHours() < 10 ? "0" : ""}${msgDate.getHours()}:`;

  dateStr += `${msgDate.getMinutes() < 10 ? "0" : ""}${msgDate.getMinutes()}`;

  return dateStr;
}
