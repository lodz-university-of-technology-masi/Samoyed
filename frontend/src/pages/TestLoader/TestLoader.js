import React, { useState, useEffect, useCallback } from "react";
import apiRequest from "../../ApiRequest";
import Loader from "../../components/UI/Loader/Loader";
import TestCreate from "../TestCreate/TestCreate";

export default function TestLoader(props) {
  const [params] = useState({ ...props.match.params });
  const [loaded, setLoaded] = useState(false);
  const [viewVersion, setViewVersion] = useState(-1);
  let formattedData;
  const [test, setTest] = useState();

  const formatData = useCallback(
    function() {
      if (viewVersion >= 0) {
        for (var i = 0; i < test.versions.length; i++) {
          for (var j = 0; j < test.versions[i].questions.length; j++) {
            let question = {
              content: "",
              type: "",
              answers: ""
            };
            question.content = test.versions[i].questions[j].content;
            question.type = test.versions[i].questions[j].type;
            if (test.versions[i].questions[j].type === "W") {
              // Close question
              question.answers = test.versions[i].questions[j].answers.split(
                "|"
              );
            } else {
              question.answers = test.versions[i].questions[j].answers;
            }
            formattedData.versions[i].questions[j] = question;
          }
        }
      }
      setLoaded(true);
    },
    [formattedData.versions, test.versions, viewVersion]
  );

  // Load question from API
  useEffect(() => {
    apiRequest({
      method: "GET",
      path: "tests/id/" + params.id,
      success: function(res) {
        setTest(JSON.parse(res.responseText));
        formattedData.id = test.id;
        formattedData.versions = test.versions;
        setViewVersion(test.versions.length);
        formatData();
      },
      error: function(err) {
        console.log(err);
        // ??
      }
    });
  }, [
    formatData,
    formattedData.id,
    formattedData.versions,
    params.id,
    test.id,
    test.versions
  ]);

  return loaded ? (
    <TestCreate edited={formattedData} />
  ) : (
    <Loader>
      <h1>Ładowanie...</h1>
    </Loader>
  );
}
