import { useState } from "react";
import { constructTextWithHyperlink } from "./search_sort";
export function AnswerForm({ pageData, model, onSubmit }) {
  console.log(pageData[0]);
  const [inputs, setInputs] = useState("");
  const [errors, setErrors] = useState({
    user: "",
    text: "",
  });

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    const text = inputs.text;
    const user = inputs.user;
    let isValid = true;

    if (text.trim() === "") {
      isValid = false;
      newErrors.text = "Text field is empty. Try again.";
    } else if (constructTextWithHyperlink(text) === undefined) {
      isValid = false;
      newErrors.text =
        'Hyperlink format is wrong. It is missing "http://" or "https://" inside ().  Try again.';
    } else {
      newErrors.text = "";
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
      console.log(`Text: ${inputs.text}\n User:${inputs.user}`);
      const newAnswer = makeNewAnswer(inputs.text, inputs.user);
      console.log(newAnswer);
      console.log(pageData[0]);
      onSubmit(newAnswer, pageData[0]);
    }
  };

  return (
    <div className="answer-form-container">
      <form
        id="postAnswer"
        className="postAnswer"
        method="POST"
        onSubmit={handleSubmit}
      >
        <p style={{ fontSize: 20 }}>Username *</p>
        <p style={{ fontStyle: "italic" }}></p>
        <input
          id="user"
          name="user"
          value={inputs.user || ""}
          onChange={changeHandler}
          required
        />
        <p id="userError" className="errorMsg">
          {errors.user}
        </p>

        <p style={{ fontSize: 20 }}>Answer Text *</p>
        <p style={{ fontStyle: "italic" }}></p>
        <textarea
          id="text"
          name="text"
          value={inputs.text || ""}
          onChange={changeHandler}
          required=""
        ></textarea>
        <p id="textError" className="errorMsg">
          {errors.text}
        </p>

        <div className="bottom-post">
          <button type="submit">Post Answer</button>
          <span>* indicates mandatory fields</span>
        </div>
      </form>
    </div>
  );
}

function makeNewAnswer(text, username, model) {
  const newAnswer = {
    text: text,
    ans_by: username,
    ans_date_time: new Date()
  };
  return newAnswer;
}
