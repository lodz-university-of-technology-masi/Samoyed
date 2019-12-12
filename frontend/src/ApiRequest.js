export default function apiRequest(options) {
    let xhr = new XMLHttpRequest()
    xhr.open(
        options.method, 
        "https://8mx18wwru3.execute-api.us-east-1.amazonaws.com/dev/" + options.path,
        true
    )
    xhr.onload = function(e) {
        options.success(xhr)
    }
    xhr.onerror = function(e) {
        options.error(xhr)
    }
    xhr.send(options.body)
}
