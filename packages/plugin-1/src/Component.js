export function MyPlugin1(text = "Hello, Webpack!") {
    const element = document.createElement("h1");
    console.log(text)
    element.innerHTML = text;
    return element;
}