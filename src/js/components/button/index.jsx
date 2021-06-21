const Button = class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
    this.ref = React.createRef();
  }

  render() {
    return (
      <button ref={this.ref}>test button</button>
    );
  }
};

// const Button = React.forwardRef((props, ref) => (
//   <button ref={ref} className="FancyButton">
//     { props.children }
//   </button>
// ));

export default Button;
