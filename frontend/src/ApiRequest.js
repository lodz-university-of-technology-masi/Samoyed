import store from "./redux/store";

export default function apiRequest(options) {
  let xhr = new XMLHttpRequest();
  xhr.open(
    options.method,
    "https://8mx18wwru3.execute-api.us-east-1.amazonaws.com/dev/" +
      options.path,
    true
  );
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.success(xhr);
      } else {
        options.error(xhr);
      }
    }
  };
  // Automatically attach Cognito token if present
  const state = store.getState();
  if (state.isLogged) {
    let token = state.tokens.idToken;
    xhr.setRequestHeader("Authorization", "Bearer " + token);
  }
  // Send request
  if (options.body) xhr.send(JSON.stringify(options.body));
  else xhr.send(null);
}
