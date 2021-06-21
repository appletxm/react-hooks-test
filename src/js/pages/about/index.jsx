import { Consumer } from '../../providers/app-ctx';

class About extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    /* eslint-disable */
    return (
      <Consumer>
       {({ name, appPrefix }) => (<div className={`${appPrefix}-p-about`}>This is about page {name}</div>)}
      </Consumer>
    );
    /* eslint-enable */
  }
}

export default About;
