---
title: "AWS Amplify"
published: false
---

Install the CLI.

```console
~# npm install -g @aws-amplify/cli
~# amplify configure
~# sudo apt install default-jre // For amplify mock
```

Initialize a new app.

```console
~# expo init
~# npx create-react-app
```

## Server

Initialize Amplify.

```console
~# amplify init
```

## Client

```console
~# expo install aws-amplify aws-amplify-react-native @react-native-community/netinfo
```

```javascript
import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
```

### API

```console
~# amplify add api
```

```javascript
import { API } from "aws-amplify";
```

### Authentication

```console
~# amplify add auth
```

```javascript
import { Auth } from "aws-amplify";
```

```javascript
import { withAuthenticator } from "aws-amplify-react-native";

export default withAuthenticator(App);
```
