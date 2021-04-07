# Building a Component Library with NPM, React and Storybook

1. React

## React

Initialize a new node package an dinstall React and Typescript dependencies.

```console
npm init --scope=@cmargieson
```

Install React and Typescript types

```json
{
  "peerDependencies": {
    "@types/react": "^17.0.3",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
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

Add component/s in src/***.tsx

```tsx
// src/Button.tsx

export interface Props {
 /**
   * The background color to render
   */
  color?: string;

  /**
   * The label to render
   */
  label?: string;
}

export const Button = (props: Props) => {
  const { color, label } = props;

  return <button style={{ backgroundColor: color }}>{label}</button>;
};
```

```tsx
// src/Button.stories.tsx

import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    color: { control: "color" },
  },
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  label: "Button",
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

## Storybook

``` 
npm install react-dom
```

```console
npx sb init
```

```console
npm run storybook
```