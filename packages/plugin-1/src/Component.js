export function MyPlugin1(text = "Hello, Webpack!") {
    const element = document.createElement("h1");

    element.innerHTML = text;
    console.log('erererer')
    return element;
}