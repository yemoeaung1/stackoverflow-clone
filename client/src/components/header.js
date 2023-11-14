export default function SiteHeader(props) {
  return (
    <div id="header" className="header">
        <h1 id="site-name"> Fake Stack Overflow </h1>
        <div id="search-div">
          <div id="search-div-div">
            <input id="search-inp" type="text" placeholder="Search..." onKeyUp={(e) => props.handlers[1](e)}/>
            </div> 
        </div>
    </div>
  );
}