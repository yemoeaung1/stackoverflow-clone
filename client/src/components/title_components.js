function ElementNum (props) {
    return (<div id={props.elID}>{`${props.elNum} ${props.elName}`}</div>);
}

function ElementTitle (props) {
    return (<div id={props.elID}>{`${props.elCategory} ${props.elName}`}</div>);
}

export { ElementNum, ElementTitle };