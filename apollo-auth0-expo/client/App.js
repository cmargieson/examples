import React from "react";
import { StyleSheet, Text, View } from "react-native";
// Apollo
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useQuery, gql } from "@apollo/client";
// Expo
import { getItemAsync } from "expo-secure-store";
import { StatusBar } from "expo-status-bar";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const GRAPHQL_DOMAIN = "192.168.1.108:4000";

// URI to the GraphQL server
const httpLink = createHttpLink({
  uri: `http://${GRAPHQL_DOMAIN}/`,
});

// Add authorization token to headers
const authLink = setContext(async (_, { headers }) => {
  // Get authorization token from secure storage
  // Returns null if there is no entry for the key
  const token = await getItemAsync("access_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <View style={styles.button}>
          <LoginButton title="Login" />
        </View>
        <View style={styles.button}>
          <LogoutButton title="Logout" />
        </View>
        <User />
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}

const USER = gql`
  query User {
    user {
      id
    }
  }
`;

function User() {
  const { data } = useQuery(USER);

  return <Text>{data?.user?.id || "No user"}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 16,
  },
});
