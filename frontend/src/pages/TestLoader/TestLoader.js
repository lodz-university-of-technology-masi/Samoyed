import React, { useState, useEffect, useMemo } from "react";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import TestCreate from "../TestCreate/TestCreate";

export default function TestLoader(props) {
  const [params] = useState({ ...props.match.params });
  const [loaded, setLoaded] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [data, setData] = useState();
  // Load question from API
  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "tests/id/" + params.id,
      success: function(res) {
        let test = JSON.parse(res.responseText);
        let data = { id: test.id, versions: test.versions };
        setData(data);
      },
      error: function(err) {
        console.log(err);
        // ??
      }
    });
  }, [params.id]);

  const formatData = useMemo(() => {
    if (data !== undefined) {
      var modifiedData = { ...data };
      for (var i = 0; i < data.versions.length; i++) {
        for (var j = 0; j < data.versions[i].questions.length; j++) {
          let question = {
            content: "",
            type: "",
            answers: ""
          };
          question.content = data.versions[i].questions[j].content;
          question.type = data.versions[i].questions[j].type;
          if (data.versions[i].questions[j].type === "W") {
            // Close question
            question.answers = data.versions[i].questions[j].answers.split("|");
          } else {
            question.answers = data.versions[i].questions[j].answers;
          }
          modifiedData.versions[i].questions[j] = question;
        }
      }
      setFormattedData(modifiedData);
      setLoaded(true);
    }
  }, [data]);

  return loaded ? (
    <>
      {formatData}
      <TestCreate edited={formattedData} />
    </>
  ) : (
    <Loader>
      <h1>Ładowanie...</h1>
    </Loader>
  );
}
