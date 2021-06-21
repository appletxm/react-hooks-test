// const Input = class extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       date: new Date()
//     };
//     this.ref = React.createRef()
//   }

//   render() {
//     return (
//       <input type="text" ref={ref} className="FancyButton" />
//     );
//   }
// }

const Input = function Input(props) {
  return (
    <input type="text" ref={props.inputRef} className="FancyButton" />
  );
};

Input.propTypes = {
  inputRef: PropTypes.func,
};

export default Input;
