# surfn

Generates styled components from tailwind classNames using [tailwind-styled-components](https://www.npmjs.com/package/tailwind-styled-components) to new style file 🏄‍♂️

---

## How to use

To extract classes into a new file, highlight a piece of code that contains an element styled with tailwind classes, open command palette (Cmd+Shift+P) and type:

> Surfn: Generate styled components from selection.

You will be prompted to name your new style file, but it's optional.

![dotup-vscode-interface-generator Video](https://github.com/herrlax/surfn/blob/main/img/how-to-surfn.gif?raw=true)

Now you're `tailwind` classes has been extracted as styled components using `tailwind-styled-components` inside your new style file. By default, the styled components are named `StyledElement1`, `StyledElement2`, etc. Feel free to rename them and import them into your components.

## Requirements

This extention is only useful if you're using both `tailwind` and `tailwind-styled-component`.

## Release Notes

### 0.0.2

- Update icon

### 0.0.1

- Initial release
