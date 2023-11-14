import { useState } from "react";
import { constructTextWithHyperlink } from "./search_sort";

export default function PostQuestionForm({ onSubmit, model }) {
    // console.log(model.getQuestions());
  const [inputs, setInputs] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    text: "",
    tags: "",
    user: "",
  });

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    const title = inputs.title;
    const text = inputs.text;
    const tags = inputs.tags;
    const user = inputs.user;
    let isValid = true;

    let validTitle = checkTitle(title);
    if (validTitle !== title) {
      isValid = false;
      newErrors.title = validTitle;
    } else {
      newErrors.title = "";
    }
    if (text.trim() === "") {
      isValid = false;
      newErrors.text = "Text field is empty. Try again.";
    } else if (constructTextWithHyperlink(text) === undefined) {
      isValid = false;
      newErrors.text = "Hyperlink format is wrong. It is missing \"http://\" or \"https://\" inside ().  Try again.";
    } else {
      newErrors.text = "";
    }

    const validTags = checkTags(tags);
    if (!Array.isArray(validTags)) {
      isValid = false;
      newErrors.tags = validTags;
    } else {
      newErrors.tags = "";
    }

    if (user.trim() === "") {
      isValid = false;
      newErrors.user = "Username field is empty. Try again.";
    } else {
      newErrors.user = "";
    }

    setErrors(newErrors);
    //console.log(isValid);
    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("all good");
      console.log(
        `Title: ${inputs.title}\nText: ${inputs.text}\nTags:${inputs.tags}\nuser:${inputs.user}`
      );

      const validTags = checkTags(inputs.tags);
      // console.log(validTags);

      const newQuestion = makeNewQuestion(
        inputs.title,
        inputs.text,
        validTags,
        inputs.user,
        model
        // modelQuestions
      );
      // console.log(newQuestion);
      onSubmit(newQuestion);
    }
  };
  return (
    <div className="question-form-container">
    <form id="postQuestion" className="postQuestion" onSubmit={handleSubmit} method="POST">
      <p style={{ fontSize: 20 }}>Question Title*</p>
      <p className="hint">Limit title to 100 characters or less</p>
      <input
        id="title"
        name="title"
        value={inputs.title || ""}
        onChange={changeHandler}
        required
      />
      <p id="titleError" className="errorMsg">
        {errors.title}
      </p>

      <p style={{ fontSize: 20 }}>Question Text *</p>
      <p className="hint">Add details</p>
      <textarea
        id="text"
        name="text"
        value={inputs.text || ""}
        onChange={changeHandler}
        required
      ></textarea>
      <p id="textError" className="errorMsg">
        {" "}
        {errors.text}
      </p>

      <p style={{ fontSize: 20 }}>Tags *</p>
      <p className="hint">Add keywords separated by whitespace</p>
      <input
        id="tags"
        name="tags"
        value={inputs.tags || ""}
        onChange={changeHandler}
        required
      />
      <p id="tagError" className="errorMsg">
        {" "}
        {errors.tags}
      </p>

      <p style={{ fontSize: 20 }}>Username *</p>
      <p className="hint"></p>
      <input
        id="user"
        name="user"
        value={inputs.user || ""}
        onChange={changeHandler}
        required
  
      />
      <p id="userError" className="errorMsg">
        {" "}
        {errors.user}
      </p>

      <div className="bottom-post">
        <button type="submit">Post Question</button>
        <span>* indicates mandatory fields</span>
      </div>
    </form>
    </div>
  );
}

//check valid title
function checkTitle(title) {
  //console.log(title.value);

  //check for whitespace and blank inputs
  if (title.replace(/\s+/g, "").length === 0) {
    return "Title is empty. Try again";
  }
  if (title.length > 100) {
    return "Title is longer than 100 characters. Try again.";
  }
  return title;
}

//check valid tag
function checkTags(tags) {
  // console.log(tags.value);

  //remove whitespaces and gets rid of empty strings
  let tagsArray = tags.split(/\s+/).filter(Boolean);


  tagsArray.forEach(function (value, index) {
    tagsArray[index] = value.toLowerCase();
  });


  tagsArray = tagsArray.filter(function (value, index) {
    if (tagsArray.indexOf(value) === index) return true;
    return false;
  });

  //check for whitespace and blank inputs
  if (tags.replace(/\s+/g, "").length === 0) {
    return "Tags field is empty. Try again";

    //check how many tags there are
  } else if (tagsArray.length > 5) {
    return "Limit of 5 tags reached";
  }
  //check each tag's length
  for (let i = 0; i < tagsArray.length; i++) {
    if (tagsArray[i].length > 10) {
      return "Tag too long";
    }
  }
  console.log(tagsArray);
  return tagsArray;
}

function makeNewQuestion(title, text, tags, username) {
  const newQuestion = {
    title: title,
    text: text,
    askDate: new Date(),
    views: 0,
    askedBy: username,
    tags: tags,
    ansIds: [],
  };
  return newQuestion;
}

// //might be able to be done better
// function addTags(model, tags) {
//   console.log("adding tags now");

//   console.log(tags);
//   tags.forEach(function (value, index) {
//     tags[index] = value.toLowerCase();
//   });

//   tags = tags.filter(function (value, index) {
//     console.log(value + ": " + index + " | " + tags.indexOf(value));
//     if (tags.indexOf(value) === index) return true;
//     return false;
//   });

//   const modelTags = model.getTags();
//   const tagIds = [];

//   for (let modelTag of modelTags) {
//     for (let index in tags) {
//       if (tags[index].toLowerCase() === modelTag.name.toLowerCase()) {
//         tagIds.push(modelTag.tid);
//         tags.splice(index, 1);
//       }
//     }
//   }
//   let remainingNewTags = tags;
//   for (let tag of remainingNewTags) {
//     let newTag = model.addTag(tag);
//     tagIds.push(newTag.tid);
//   }
//   // console.log(tagIds);
//   return tagIds;
// }
