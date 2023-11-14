function Posts({ questions, modelTags, handlers }) {
  //console.log(questions);
  if (questions.length === 0) {
    const myStyle = {
      fontSize: 40,
      textAlign: "center",
      marginTop: "15%",
    };
    return <h2 style={myStyle}>No questions found </h2>;
  }
  return (
    <>
      {questions.map((question) => {
        return (
          <Post
            key={question._id}
            question = {question}
            {...question}
            modelTags={modelTags}
            handlers={handlers}
          ></Post>
        );
      })}
    </>
  );
}

function Post({
  question,
  views,
  title,
  asked_by,
  answers,
  ask_date_time,
  tags,
  _id,
  handlers,
  modelTags,
}) {
  // console.log(JSON.stringify(question));
  // console.log(tags);
  // console.log(modelTags);
  const questionTags = getQuestionTagNames(modelTags, tags);
  // console.log(questionTags);
  let ask_date_time_string = getLocaleString(ask_date_time);
  // console.log(new Date());

//   const fetchQuestion = async () => {try {
//     const res = await axios.get("http://localhost:8000/posts/question/" + _id);
//     const question = res.data;
//     console.log("clicked questions" + question);
//     return question;
//   } catch (error) {
//     console.error(error);
//     // Handle errors if needed
//     return null;
//   }
// };

  const handleTitleClick = () => {
    handlers[0]("answers", [_id]);
  };
  return (
    <div className="post-container">
      <div className="statsBox">
        <p>
          {answers.length} answer{answers.length !== 1 ? "s" : ""}
        </p>
        <p>
          {views} view{views !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="title-and-tags">
        <p className="post-title" onClick={handleTitleClick}>
          {title}
        </p>
        <div className="tag-container">
          {questionTags.map((questionTag, tags) => {
            return (
              <div key={tags} className="question-tag">
                {" "}
                {questionTag}{" "}
              </div>
            );
          })}
        </div>
      </div>
      <div className="date-user">
        <p>
          <span className="user">{asked_by} </span>
          {showDateMetadata(new Date(ask_date_time_string), "asked")}
        </p>
        <p></p>
      </div>
    </div>
  );
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

function getQuestionTagNames(modelTags, tagIds) {
  const questionTags = [];
  const questionTagIds = tagIds;
  for (let tag of modelTags) {
    for (let questionTagId of questionTagIds) {
      if (questionTagId === tag._id) {
        questionTags.push(tag.name);
      }
    }
  }
  return questionTags;
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

export default Posts;
