import React, { useEffect } from "react";
import { Button } from "react-native";
// Apollo
import { useApolloClient } from "@apollo/client";
// Expo
import {
  makeRedirectUri,
  Prompt,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";
import { setItemAsync } from "expo-secure-store";

// Constants
const AUTH0_DOMAIN = "2g9cipk5.au.auth0.com";
const AUTH0_CLIENT_ID = "CENkCLy0PmaqBP4TAq3YYGH0l564g8bS";

const redirectUri = makeRedirectUri({ useProxy: true });

// Redirect URL, add to callback URL list in Auth0
console.log(`Redirect URL: ${redirectUri}`);

const nonce = Math.random();

const LoginButton = (props) => {
  const client = useApolloClient();

  const [request, result, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      prompt: Prompt.Login, // Always prompt user to login
      scopes: ["openid", "profile", "email"],
      extraParams: {
        nonce,
      },
    },
    { authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize` }
  );

  useEffect(() => {
    if (result) {
      if (result.type === "success") {
        // Retrieve access token
        const accessToken = result.params?.access_token;

        // Save access token secure store
        const saveToken = async () =>
          await setItemAsync("access_token", accessToken);
        saveToken();

        // Refetch queries
        client.resetStore();
      }
    }
  }, [result]);

  return (
    <Button
      disabled={!request}
      onPress={() => promptAsync({ useProxy: true })}
      {...props}
    />
  );
};

export default LoginButton;
