import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Form.css';
import { loadForecast } from '../../actions';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      emptyCity: false,
      searchHappened: false,
    };

    this.textInput = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.submitName = this.submitName.bind(this);
  }

  componentDidMount() {
    this.textInput.current.focus();
  }

  getErrorMessage() {
    if (this.state.emptyCity) {
      return 'Field cannot be empty';
    } else if (this.props.error && !this.props.loading) {
      return this.props.city
        ? `Such city is not found. Displaying forecast for ${this.props.city}`
        : 'Such city is not found';
    }

    return '';
  }

  submitName(event) {
    event.preventDefault();
    if (this.state.name.length >= 3) {
      this.setState({ emptyCity: false, searchHappened: true });
      this.props.loadForecast(this.state.name);
    } else this.setState({ emptyCity: true });
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  render() {
    const formClass = classNames({
      form: true,
      toolbar: this.state.searchHappened,
    });

    return (
      <form className={formClass} onSubmit={this.submitName}>
        <div className="content">
          <div className="title">Intelecy challenge!</div>
          <input
            type="text"
            placeholder="Enter a city"
            ref={this.textInput}
            value={this.state.name}
            onChange={this.handleChange}
          />
          <button type="submit" disabled={this.props.loading}>Search!</button>
        </div>
        <divS className="error-msg">{this.getErrorMessage()}</divS>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return ({
    loading: state.forecast.loading,
    error: state.forecast.error,
    city: state.forecast.city,
  });
}

function mapDispatchToProps(dispatch) {
  return ({
    loadForecast: city => dispatch(loadForecast(city)),
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
