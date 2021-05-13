import React from 'react';

const ReportedAnswerButton = function ({ answer, reportAnswer, state }) {
  if (state[`reportedAnswer${answer.id}`] === undefined) {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();

            reportAnswer(answer.id);

        }}
      >
        Report
      </a>
    );
  }
  return <span className="qa-reported-answer-button">Reported</span>;
};

export default ReportedAnswerButton;
