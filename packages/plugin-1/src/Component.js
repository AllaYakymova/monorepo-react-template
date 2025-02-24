export function MyPlugin1(text = "Hello, Webpack!") {
    const element = document.createElement("h1");
    element.innerHTML = text;

    console.log('pr check')
    // there is no styles here
    return element;
}