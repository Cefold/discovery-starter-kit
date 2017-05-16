import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import ResultsContainer from '../containers/ResultsContainer/ResultsContainer';
import { Icon } from 'watson-react-components';
import * as query from '../actions/query';
import { shallow } from 'enzyme';

describe('<App />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('has no loading spinner or results on initial load', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Icon)).toHaveLength(0);
    expect(wrapper.find(ResultsContainer)).toHaveLength(0);
  });

  describe('when the query is loading', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<App />);
      wrapper.setState({fetching: true});
    });

    it('shows a loading spinner', () => {
      expect(wrapper.find(Icon)).toHaveLength(1);
      expect(wrapper.find(ResultsContainer)).toHaveLength(0);
    });
  });

  describe('when the query has loaded', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<App />);
      wrapper.setState({results_fetched: true});
    });

    it('shows the results container', () => {
      expect(wrapper.find(Icon)).toHaveLength(0);
      expect(wrapper.find(ResultsContainer)).toHaveLength(1);
    });
  });

  describe('when handleSearch is called with a query string', () => {
    let wrapper;

    beforeEach(() => {
      query.default = jest.fn();
      wrapper = shallow(<App />);
      wrapper.instance().handleSearch('my query');
    });

    it('submits a query to the regular and enriched collections', () => {
      expect(query.default).toBeCalledWith('enriched', {'query': 'my query'});
      expect(query.default).toBeCalledWith('regular', {'query': 'my query'});
    });
  });
});
