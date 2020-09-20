import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';

type StateType = {
  link?: string;
  name?: string;
};
class Downloader extends Component<{}, StateType> {
  ref = createRef<HTMLAnchorElement>();
  state: StateType = {};
  get(link: string, name: string = '') {
    this.setState({ link, name }, () => {
      this.ref.current?.click();
    });
  }
  render() {
    return <a ref={this.ref} href={this.state.link} download={this.state.name} />;
  }
}

const div = document.createElement('div');
document.body.appendChild(div);
let api = ReactDOM.render(React.createElement(Downloader), div);
export default api;
