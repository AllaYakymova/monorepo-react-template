export function MyPluginComponent(text = "Plugin Component Here (from monorepo)") {
    const element: HTMLElement = document.createElement("h3");
    console.log({ element })
    element.innerHTML = text;

    return element;
}