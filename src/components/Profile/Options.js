import { View, Text, } from "react-native";
import React, { useState, useEffect } from "react";
import profileStyle from "../../styles/profileStyles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  addFriendAsync,
  removeFriendAsync,
  acceptFriendAsync,
  getFriendRequestAsync
} from "../../util";

const Options = ({data}) => {
  const navigation = useNavigation();
  const [isFriendAdded, setFriendAdded] = useState(false);
  const [isFriend, setIsFriend] = useState("Added");

  useEffect(() => {
    const fetchData = async () => {
      if (receivedData == null) {
        navigation.navigate("main");
      }

      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);

      const dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );
      const dataRequest = await getFriendRequestAsync(dataUserLocal.id, dataUserLocal.accessToken)
      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserAsync = await getUserDataAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        )
        dataRequest = await getFriendRequestAsync(dataUserLocal.id, dataUpdate.accessToken)
      }

      if ("errors" in dataUserAsync) {
        navigation.navigate("main");
      }

      if (dataUserAsync.friends.includes(data.id)) {
        setFriendAdded("Friend")
        setFriendAdded(true);
      }

      for (let friends of dataRequest) {
        if (friends.createdUserId === data.id) {
          setFriendAdded("Accept")
          setFriendAdded(false)
        }
      }

    };

    fetchData();
  }, [data]);

  const handleAddFriendPress = () => {
    // if (isFriendAdded === "Friend" && isFriendAdded) {
    //   await removeFriendAsync()
    // }
    // else if (isFriendAdded === "Accept" && !isFriendAdded) {
    //   setIsFriend("Friend");
    //   await acceptFriendAsync
    // }
    // else if (isFriendAdded === "Added" && isFriendAdded) {
    //   await removeFriendAsync()
    // }
    // else {
    //   await addFriendAsync()
    // }
    setFriendAdded(!isFriendAdded);

  };

  return (
    <View
      style={{
        flexDirection: "row",
        marginVertical: 10,

        paddingBottom: 15,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={[
          profileStyle.editContainer,
          isFriendAdded ? { backgroundColor: "#1E90FF" } : null,
          { marginHorizontal: 12 },
        ]}
        onPress={handleAddFriendPress}
      >
        <Text style={profileStyle.textEdit}>
          {isFriendAdded ? isFriend : "Add Friend"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[profileStyle.editContainer, { paddingHorizontal: 18 }]}
      >
        <Text style={profileStyle.textEdit}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Options;