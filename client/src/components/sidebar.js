export default function SideBar(props) {
    let qColor = props.menuSelector[0] === 0 ? {backgroundColor:""} : {backgroundColor:"lightgray"};
    let tColor = props.menuSelector[1] === 0 ? {backgroundColor:""} : {backgroundColor:"lightgray"};

    return (
    <div id="menu" className="menu">
        <div id="question-menu-div" className= "menu-div" style={qColor}>
            <a id="question-pg" className="menu" onClick={() => {props.handlers[0]("questions", ["All Questions", "default"])}} href="#root">Questions</a>
        </div>
        <div id="tag-menu-div" className= "menu-div" style={tColor}>
            <a id ="tag-pg" className="menu" onClick={() => {props.handlers[0]("tags", [])}} href="#root">Tags</a>
        </div>
    </div>
    );

}