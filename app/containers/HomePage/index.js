/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryBrushContainer,
  VictoryZoomContainer,
} from 'victory';

import {
  makeSelectSpeedTests,
  makeSelectLoading,
  makeSelectError,
  makeSpeedTestData,
} from 'containers/App/selectors';
import CenteredSection from './CenteredSection';
import Section from './Section';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';


export class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  state = {
    counter: 0,
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.onSubmitForm();  
  }

  updateCounter = () => this.setState({ counter: this.state.counter + 1 })

  formatXAxis = (x) => {
    const date = new Date(x);
    return `${date.getHours()}`;
  }

   handleZoom(domain) {
    this.setState({selectedDomain: domain});
  }

  handleBrush(domain) {
    this.setState({zoomDomain: domain});
  }

  render() {
    const {
      loading,
      error,
      speedTests,
      graphData,
    } = this.props;
    const speedTestsListProps = {
      loading,
      error,
      speedTests,
    };
    // console.error('graphData', graphData);
    
    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'A React.js Boilerplate application homepage' },
          ]}
        />
        <VictoryChart
          width={600}
          height={400}
          scale={{ x: "time" }}
          containerComponent={
            <VictoryZoomContainer
              dimension="x"
              zoomDomain={this.state.zoomDomain}
              onDomainChange={this.handleZoom.bind(this)}
            />
          }
        >  
          <VictoryLine
            style={{
              data: {stroke: 'tomato'}
            }}
            data={graphData}
            x="time"
            y="download"
          />
        </VictoryChart>
        <VictoryChart
          padding={{top: 0, left: 50, right: 50, bottom: 30}}
          width={600} height={100} scale={{x: "time"}}
          containerComponent={
            <VictoryBrushContainer
              dimension="x"
              selectedDomain={this.state.selectedDomain}
              onDomainChange={this.handleBrush.bind(this)}
            />
          }
        >
          <VictoryLine
            style={{
              data: {stroke: 'tomato'}
            }}
            data={graphData}
            x="time"
            y="download"
          />
        </VictoryChart>
        <div>
          {speedTests && speedTests.tests && speedTests.tests.map(test => test.speeds.download)}
          <CenteredSection>
          </CenteredSection>
          <Section>
          </Section>
          <button onClick={this.updateCounter}>
            {this.state.counter}
          </button>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  speedTests: makeSelectSpeedTests(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  graphData: makeSpeedTestData(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
