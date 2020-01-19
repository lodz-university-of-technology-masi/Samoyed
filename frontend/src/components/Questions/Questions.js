import React from 'react';
import AnswersBlock from '../../components/AnswersBlock/AnswersBlock'

const Questions = props => {
	return props.questions.map((q, i) => {
    return (
      <div key={i}>
        <div className="form-inline row" key={i}>
          <input
            required
            className="form-control mr-2 mb-2"
            placeholder="Pytanie"
            value={q.content}
            onChange={e => {
              props.changeContentCreation(i, e.target.value);
            }}
          />
          <select
            required
            className="form-control mr-2 mb-2"
            value={q.type}
            onChange={e => {
              props.changeType(i, e.target.value);
            }}
          >
            <option value="W">Wyboru</option>
            <option value="O">Otwarte</option>
            <option value="L">Liczbowe</option>
          </select>
          <button
            className="btn btn-danger mr-2 mb-2"
            onClick={props.deleteQuestion}
            name={i}
          >
            Usuń
          </button>
        </div>
        <AnswersBlock
            q={q}
            i={i}
            changeAnswersCorrectCreation={props.changeAnswersCorrectCreation}
            changeAnswersComplexCreation={props.changeAnswersComplexCreation}
            changeAnswersSimpleCreation={props.changeAnswersSimpleCreation}
        />
      </div>
    );
  });
}
export default Questions;
