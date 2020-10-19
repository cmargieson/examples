import React from "react";
import { Button } from "react-native";
// Apollo
import { useApolloClient } from "@apollo/client";
// Expo
import { deleteItemAsync } from "expo-secure-store";

const LogoutButton = ({ ...props }) => {
  const client = useApolloClient();

  return (
    <Button
      onPress={async () => {
        // Delete authorization token from secure storage
        // Returns null if there is no entry for the key
        await deleteItemAsync("access_token");

        // Refetch queries
        client.resetStore();
      }}
      {...props}
    />
  );
};

export default LogoutButton;
