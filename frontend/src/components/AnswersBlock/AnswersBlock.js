import React from 'react';

const AnswersBlock = props => {
    // Depending on question type, this renders different blocks for possible answers
    let answersBlock;
    if (props.q.type === "W") {
      answersBlock = [];
      for (let m = 0; m < 4; m++) {
        answersBlock.push(
          <>
            <input
              className="form-check-input"
              type="checkbox"
              onChange={e => {
                props.changeAnswersCorrectCreation(props.i, m, e.target.checked);
              }}
              checked={props.q.answers[m].correct}
            />
            <input
              className="form-control mr-2"
              placeholder={"Odpowiedź " + (m + 1)}
              onChange={e => {
                props.changeAnswersComplexCreation(props.i, m, e.target.value);
              }}
              value={props.q.answers[m].value}
            />
          </>
        );
      }
      return (
        <div className="form-group form-inline row">{answersBlock}</div>
      )        
      
    } else {
      return (
        <div className="form-group row">
          <input
            className="form-control"
            placeholder="Odpowiedzi"
            value={props.q.answers}
            onChange={e => {
              props.changeAnswersSimpleCreation(props.i, e.target.value);
            }}
          />
        </div>
      );
    }
}

export default AnswersBlock;