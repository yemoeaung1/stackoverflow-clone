import { tagSearch, sortResults } from "./search_sort.js";
import { ElementNum, ElementTitle } from "./title_components.js";
import { AskQuestionButton } from "./button_components.js";
import React from "react";

function TagPage(props) {
    return (
        <>
            <TagUpperContent modelTags={props.modelTags} handlers={props.handlers} />
            <TagLowerContent modelQuestions={props.modelQuestions} modelTags={props.modelTags} handlers={props.handlers}/>
        </>
    );
}

function TagUpperContent(props) {
    return (
        <div id="upper-tag-content">
            <ElementNum elID="tag-num-box" elNum={props.modelTags.length} elName={`Tag${props.modelTags.length > 1 ? 's' : ''}`}/>
            <ElementTitle elID="tag-page-title" elCategory="All" elName="Tags"/>
            <TagAskQuestionButton handlers={props.handlers} />
        </div>
    );
}

function TagAskQuestionButton(props){
    return (
        <div id="tag-button-container">
            <AskQuestionButton handlers={props.handlers} />
        </div>
    );
}

function TagLowerContent (props) {
    let tagsArr = props.modelTags;
    const colArr1 = [];
    const colArr2 = [];
    const colArr3 = [];

    for (let i = 0; i < tagsArr.length; i++) {
        if (i % 3 === 0)
            colArr1.push(tagsArr[i]);
        else if (i % 3 === 1)
            colArr2.push(tagsArr[i]);
        else
            colArr3.push(tagsArr[i]);
    }

    return (
        <div id="lower-tag-content">
            <TagPageCol tagsColID="tag-col1" tagsArr={colArr1} modelQuestions={props.modelQuestions} handlers={props.handlers} />
            <TagPageCol tagsColID="tag-col2" tagsArr={colArr2} modelQuestions={props.modelQuestions} handlers={props.handlers} />
            <TagPageCol tagsColID="tag-col3" tagsArr={colArr3} modelQuestions={props.modelQuestions} handlers={props.handlers} />
        </div>
    );
}

function TagPageCol(props) {
    const finalCol = [];
    
    for (let i = 0; i < props.tagsArr.length; i++){
        let tag = props.tagsArr[i];
        finalCol.push( <TagPageCell key={tag.name} cellInfo={tag} modelTags = {props.tagsArr} modelQuestions={props.modelQuestions} handlers={props.handlers} /> );
        finalCol.push( <TagPagePartition key={tag._id}/> );
    }

    return (
        <div className="tag-col" id={props.tagsColID}>
            {finalCol}
        </div>
    );
}

function TagPageCell(props) {
    let qArr = tagSearch([props.cellInfo.name], props.modelTags, props.modelQuestions);

    qArr = sortResults("newest", qArr);
    console.log(qArr);

    return (
        <div className="tag-cell">
            <a className="tag-cell-info" id="tag-cell-link" onClick={() => {props.handlers[0]("questions", [`Tag Search for ${props.cellInfo.name}`, ...qArr])}} href="#root">{props.cellInfo.name}</a>
            <p className="tag-cell-info">{`${qArr.length} question${qArr.length > 1 ? 's' : ''}`}</p>
        </div>
    );
}

function TagPagePartition() {
    return <div className="tag-partition"></div>
}

export default TagPage;

/*
TODO
Add Ask Question Button
EventListener Links
*/