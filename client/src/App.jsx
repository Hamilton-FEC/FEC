import React from 'react';
import style from './style.scss';
import RatingsReviews from './RatingsReviews/RatingsReviews.jsx';
import QuestionsAndAnswers from './QuestionsAndAnswers/QuestionsAndAnswers.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        react is up and running
        <QuestionsAndAnswers />
        <RatingsReviews />
      </div>
    );
  }
}

export default App;
