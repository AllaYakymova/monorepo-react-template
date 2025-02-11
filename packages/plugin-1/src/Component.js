export function MyPlugin1(text = "Hello, Webpack!") {
    const element = document.createElement("h1");
    console.log(element)
    element.innerHTML = text;
    return element;
}