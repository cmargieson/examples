# Building a Component Library with NPM, React and Storybook

## React

Initialize a new node package

```console
npm init --scope=@cmargieson
```

Install React

```console
npm install --save-dev react @types/react
```

Add tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Add component in src/index.tsx

```jsx
export interface Props {
  /**
   * The label to render
   */
  label?: string;
}

export const Button = (props: Props) => {
  const { label } = props;

  return <button>{label}</button>;
};
```

## Rollup

Install Rollup and plugins

```console
npm install --save-dev rollup @rollup/plugin-typescript
```

Edit entrypoint in package.json

```json
{
  "main": "dist/index.js"
}
```

Add rollup.config.js

```js
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [typescript()],
  external: ["react/jsx-runtime"],
};
```

Add scripts to package.json

```json
"scripts": {
  "build": "rollup -c", // Use settings in config file
  "start": "rollup -c -w" // Reload on changes
}
````

Build & Watch

```console
npm start
```

## NPM

Create an npm link

```console
npm link
```

(to see all linked)

```console
npm ls -g --depth=0 --link=true
```

(to remove a link, use the global flag)

```console
npm remove -global name
```

In new app, for example "npx create-react-app my-app"

```console
npm link @cmargieson/npm-react-storybook
```

Use it!

```jsx
import React from "react";
import ReactDOM from "react-dom";

import { Button } from "@cmargieson/npm-react-storybook";

ReactDOM.render(<Button label="Button" />, document.getElementById("root"));
```
