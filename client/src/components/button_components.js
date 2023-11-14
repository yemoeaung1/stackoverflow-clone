function AskQuestionButton(props) {
    return (
        <div className="btn-ctn">
            <button className="ask-btn" id="ask" onClick={() => { props.handlers[0]("questionForm", []) }}>Ask Question</button>
        </div>
    );
}

/*
function PostQuestionButton (props) {
    return <button className="ask-btn" id="ask" onClick={() => props.handlers[0]("questionForm", [])}>Ask Question</button> ;
}
*/

function AnswerQuestionButton(props) {
    return <button id="answer-button" onClick={() => { props.handlers[0]("answerForm", []) }}>Answer Question</button>;
}

/*
function PostAnswerButton () {
    return <button className="ask-btn" id="ask" onClick={() => props.handlers[0]("answerForm", [])}>Answer Question</button> ;
}
*/

function SortButtons(props) {
    return (
        <div className="btn-ctn">
            <button className="three-btns" id="newest-btn" onClick={() => {props.handlers[0]("questions", ["Newest Questions", "newest"])}}>Newest</button>
             <button className="three-btns" id="active-btn" onClick={() => {props.handlers[0]("questions", ["Active Questions", "active"])}}>Active</button>
             <button className="three-btns" id="unanswered-btn" onClick={() => {props.handlers[0]("questions", ["Unanswered Questions", "unanswered"])}}>Unanswered</button>
        </div>
    );
}

export { AskQuestionButton, AnswerQuestionButton, SortButtons };