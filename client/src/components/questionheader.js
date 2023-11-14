import { AskQuestionButton, SortButtons } from "./button_components";

export default function QuestionHeader({ title, questions, handlers }) {
  return (
    <div className="upper-content">
      <div className="top-one">
        <h3>{title}</h3>
        <AskQuestionButton handlers={handlers} />
      </div>
      <div className="top-two">
        <p id="postNumberCount">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </p>
        <SortButtons handlers={handlers} modelQuestions={questions} />
      </div>
    </div>
  );
}
