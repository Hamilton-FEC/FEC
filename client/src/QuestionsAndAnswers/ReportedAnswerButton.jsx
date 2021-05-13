import React from 'react';

const ReportedAnswerButton = function ({ answer, reportAnswer, state }) {
  if (state[`reportedAnswer${answer.id}`] === undefined) {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (answer.answerer_name) {
            console.log('Reporting is disabled for these answers.')
          } else {
            reportAnswer(answer.id);
          }
        }}
      >
        Report
      </a>
    );
  }
  return <span className="qa-reported-answer-button">Reported</span>;
};

export default ReportedAnswerButton;
