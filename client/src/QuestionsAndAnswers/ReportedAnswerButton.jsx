import React from 'react';

const ReportedAnswerButton = function ({ answer, reportAnswer, state }) {
  if (state[`reportedAnswer${answer.id}`] === undefined) {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          let keep = [1720070, 1720071, 1720069, 1720068, 1720066, 1720067]
          if (keep.includes(answer.id)) {
            console.log('Do not remove')
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
