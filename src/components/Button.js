import "../css/Button.css";

function Button({ value, onClick, danger=false}) {

    return <input type="button"
                  className={"button" + (danger ? " danger" : "")}
                  value={value}
                  onClick={onClick}/>
}

export default Button;