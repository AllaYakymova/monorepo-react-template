export function MyPlugin1(text = "Hello, Webpack!") {
    const element = document.createElement("h1");
    console.log('changes')
    element.innerHTML = text;
    return element;
}