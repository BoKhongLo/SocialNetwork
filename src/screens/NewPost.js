import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import postSytles from "./../styles/newpostStyles";
import { Divider } from "react-native-elements";
import chat from "../styles/ChatStyles/chatStyles";
import {
  getUserDataAsync,
  getAllIdUserLocal,
  getDataUserLocal,
  updateAccessTokenAsync,
  uploadFile,
  createPostAsync,
  getFileByUrl,
  validatePostAsync,
} from "../util";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { FileUploadDto, PostDto } from "../util/dto";
import { Video, Audio } from "expo-av";
import LoadingAnimation from "../components/Loading/loadingAnimation";

const NewPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [receivedData, setReceivedData] = useState(route.params?.data || null);
  const insets = useSafeAreaInsets();
  const [dataUser, setDataUser] = React.useState(null);
  const [fileUpload, setFileUpload] = React.useState([]);
  const [dataPost, setDataPost] = React.useState({
    userId: "",
    content: "",
    fileUrl: [],
    postId: "",
  });
  const validateDataPost = (newData) => {
    setDataPost((dataPostPre) => {
      return {
        ...dataPostPre,
        ...newData,
      };
    });
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const keys = await getAllIdUserLocal();
      const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
      let dataUserAsync = await getUserDataAsync(
        dataUserLocal.id,
        dataUserLocal.accessToken
      );

      if ("errors" in dataUserAsync) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataUserAsync = await getUserDataAsync(
          dataUpdate.id,
          dataUpdate.accessToken
        );
      }
      setDataUser({ ...dataUserAsync });
      setDataPost((dataPostPre) => {
        return {
          ...dataPostPre,
          ...{ userId: dataUserLocal.id },
        };
      });
      if (receivedData) {
        console.log(receivedData);
        setDataPost({
          userId: receivedData.ownerUserId,
          content: receivedData.content,
          fileUrl: receivedData.fileUrl,
          postId: receivedData.id,
        });
        let dataFile = [];
        for (let i = 0; i < receivedData.fileUrl.length; i++) {
          let newFile = {
            id: receivedData.fileUrl[i],
            source: { uri: receivedData.fileUrl[i] },
          };
          dataFile.push(newFile);
        }
        setFileUpload(dataFile);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + 10,
          paddingRight: insets.right + 10,
          flex: 1,
        }}
      >
        <Header
          postData={dataPost}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <ScrollView>
          {dataUser != null && (
            <Caption
              user={dataUser}
              onUpdateData={validateDataPost}
              postData={dataPost}
            />
          )}

          {fileUpload.length > 0 && (
            <ReviewImage
              fileData={fileUpload}
              setFile={setFileUpload}
              onUpdateData={validateDataPost}
              postData={dataPost}
            />
          )}

          <ChoseImg
            upFile={setFileUpload}
            onUpdateData={validateDataPost}
            postData={dataPost}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </ScrollView>
      </View>
      <LoadingAnimation isVisible={isLoading} />
    </>
  );
};

const Header = ({ postData, isLoading, setIsLoading }) => {
  const navigation = useNavigation();

  const handleCreatePost = async () => {
    setIsLoading(true); 
    if ("fileUrl" in postData && "content" in postData) {
      if (postData.fileUrl.length == 0 && postData.content.length == 0) {
        setIsLoading(false);
        return;
      }
    }
    const dto = new PostDto(
      postData.userId,
      "POST",
      postData.content,
      postData.fileUrl,
      postData.postId
    );
    const keys = await getAllIdUserLocal();
    const dataUserLocal = await getDataUserLocal(keys[keys.length - 1]);
    if (postData.postId === "") {
      let dataReturn = await createPostAsync(dto, dataUserLocal.accessToken);
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await createPostAsync(dto, dataUpdate.accessToken);
      }
      if ("errors" in dataReturn) {
        Alert.alert(dataReturn.errors[0].message)
        setIsLoading(false)
        return
      };
    } else {
      let dataReturn = await validatePostAsync(dto, dataUserLocal.accessToken);
      if ("errors" in dataReturn) {
        const dataUpdate = await updateAccessTokenAsync(
          dataUserLocal.id,
          dataUserLocal.refreshToken
        );
        dataReturn = await validatePostAsync(dto, dataUpdate.accessToken);
      }
      if ("errors" in dataReturn) {
        Alert.alert(dataReturn.errors[0].message)
        setIsLoading(false)
        return
      };
    }
    
    navigation.replace("main");
    setIsLoading(false); 
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        height: heightPercentageToDP("8%"),
        alignItems: "center",
        borderBottomWidth: 0.5,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("main")}>
        <Image
          style={postSytles.button}
          source={require("../../assets/dummyicon/close.png")}
        />
      </TouchableOpacity>
      <Text style={{ fontSize: 20 }}>Create Post</Text>
      <TouchableOpacity
        style={{
          backgroundColor: "grey",
          paddingHorizontal: 13,
          paddingVertical: 6,
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={handleCreatePost}
      >
        <Text style={[postSytles.text, { color: "#F5F5F5" }]}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const Caption = ({ user, onUpdateData, postData }) => {
  const [inputText, setInputText] = useState(postData.content);

  const handleInputTextChange = (text) => {
    setInputText(text);
    onUpdateData({ content: text });
  };
  useEffect(() => {
    setInputText(postData.content);
  }, [postData]);
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        {user.detail.avatarUrl ? (
          <Image style={chat.avtChat} source={{ uri: user.detail.avatarUrl }} />
        ) : (
          <Image
            style={chat.avtChat}
            source={require("../../assets/img/avt.png")}
          />
        )}
        <View style={chat.nameChatContainer}>
          <Text style={chat.chatUSerName}> {user.detail.name}</Text>
          <Text>{user.detail.nickName}</Text>
        </View>
      </View>

      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <TextInput
          placeholder="Write a caption"
          style={{ padding: 15, fontSize: 20, textAlignVertical: "top" }}
          multiline={true}
          numberOfLines={8}
          value={inputText}
          onChangeText={handleInputTextChange}
        />
        <Divider width={1} orientation="vertical" />
      </View>
    </View>
  );
};

const ChoseImg = ({
  upFile,
  postData,
  onUpdateData,
  isLoading,
  setIsLoading,
}) => {
  const handleCamera = async () => {

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted === false) {
      return;
    }

    setIsLoading(true); //////////////////////////////////////

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      setIsLoading(false);
      return;
    }

    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    const dto = new FileUploadDto(
      dataLocal.id,
      result.assets[0].uri,
      `${new Date().toISOString}${dataLocal.id}.jpg`,
      "image/jpeg"
    );
    let data = await uploadFile(dto, dataLocal.accessToken);

    if ("message" in data) {
      const dataUpdate = await updateAccessTokenAsync(
        dataLocal.id,
        dataLocal.refreshToken
      );
      data = await uploadFile(dto, dataUpdate.accessToken);
    }

    if ("message" in data) {
      setIsLoading(false); 
      Alert.alert(data.message);
      return;
    }
    
    setIsLoading(false); 
    let newFile = { id: data.id, source: { uri: data.url } };
    upFile((preFile) => [...preFile, newFile]);
    let newPostData = { ...postData };
    newPostData.fileUrl.push(data.url);
    onUpdateData({ fileUrl: newPostData.fileUrl });

  };

  const handleGallery = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "video/*", "audio/*"],
    });
    setIsLoading(true); 
    if (result.type !== "success") {
      setIsLoading(false);
      return 
    }
    const keys = await getAllIdUserLocal();
    const dataLocal = await getDataUserLocal(keys[keys.length - 1]);
    let dataUpdate = await updateAccessTokenAsync(
      dataLocal.id,
      dataLocal.refreshToken
    );

    let newPostData = { ...postData };

    const dto = new FileUploadDto(
      dataLocal.id,
      result.uri,
      result.name,
      result.mimeType
    );

    let data = await uploadFile(dto, dataUpdate.accessToken);

    if ("message" in data) {
      dataUpdate = await updateAccessTokenAsync(
        dataLocal.id,
        dataLocal.refreshToken
      );
      data = await uploadFile(dto, dataUpdate.accessToken);
    }
    if ("message" in data) {
      setIsLoading(false); 
      Alert.alert(data.message);
      return;
    }
    setIsLoading(false); 
    let newFile = { id: data.id, source: { uri: data.url } };
    upFile((preFile) => [...preFile, newFile]);
    newPostData.fileUrl.push(data.url);

    onUpdateData({ fileUrl: newPostData.fileUrl });

  };

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <Text style={postSytles.text}>File Upload</Text>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Camera Button */}
        <TouchableOpacity
          onPress={handleCamera}
          style={{ alignItems: "center", flexDirection: "row", marginTop: 10 }}
        >
          <Image
            style={[postSytles.button]}
            source={require("../../assets/dummyicon/camera_2_line.png")}
          />
          <Text style={postSytles.text}>Camera</Text>
        </TouchableOpacity>

        {/* Gallery Button */}
        <TouchableOpacity
          onPress={handleGallery}
          style={{ alignItems: "center", flexDirection: "row", marginTop: 10 }}
        >
          <Image
            style={[postSytles.button]}
            source={require("../../assets/dummyicon/file_upload.png")}
          />
          <Text style={postSytles.text}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ReviewImage = ({ fileData, setFile, postData, onUpdateData }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const [imageList, setImageList] = useState(fileData);

  useEffect(() => {
    setImageList(fileData);
  }, [fileData]);

  const validateFile = (file) => {
    const imgExt = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "raf"];
    const videoExt = ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"];
    const audioExt = ["mp3", "ogg", "wav", "flac", "aac", "wma", "m4a"];
    const lastElement = file.split("/").pop();
    const fileExt = lastElement.split("?")[0].split(".").pop().toLowerCase();

    if (imgExt.includes(fileExt)) {
      return "IMAGE";
    } else if (audioExt.includes(fileExt)) {
      return "AUDIO";
    } else if (videoExt.includes(fileExt)) {
      return "VIDEO";
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedImages.includes(item.id);

    const handleDelete = () => {
      if (!setFile) return;

      const newSelectedImages = selectedImages.filter((id) => id !== item.id);
      setImageList((file) => file.filter((data) => data.id !== item.id));
      setImageList((file) => file.filter((data) => data.id !== item.id));
      let newDataPost = { ...postData };
      newDataPost.fileUrl = newDataPost.fileUrl.filter(
        (data) => data !== item.source.uri
      );
      onUpdateData({ fileUrl: newDataPost.fileUrl });
      setFile(imageList);
      setSelectedImages(newSelectedImages);
    };

    return (
      <View style={{ marginRight: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => toggleImageSelection(item.id)}>
          {validateFile(item.source.uri) === "IMAGE" ? (
            <Image
              source={{ uri: item.source.uri }}
              style={[
                postSytles.image,
                {
                  backgroundColor: isSelected ? "gray" : "lightgrey",
                  width: 90,
                  height: 90,
                },
              ]}
            />
          ) : validateFile(item.source.uri) === "VIDEO" ? (
            <Video
              style={[
                postSytles.image,
                {
                  backgroundColor: isSelected ? "gray" : "lightgrey",
                  width: 90,
                  height: 90,
                },
              ]}
              source={{ uri: item.source.uri }}
              useNativeControls
              resizeMode="contain"
            />
          ) : (
            <Video
              style={[
                postSytles.image,
                {
                  backgroundColor: isSelected ? "gray" : "lightgrey",
                  width: 90,
                  height: 90,
                },
              ]}
              source={{ uri: item.source.uri }}
              useNativeControls
              resizeMode="contain"
            />
          )}

          {isSelected && (
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: 32,
                  borderColor: "black",
                  borderWidth: 2,
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                X
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const toggleImageSelection = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={[postSytles.text, { marginBottom: 10 }]}>Preview</Text>
      <FlatList
        data={imageList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
      />
    </View>
  );
};
export default NewPost;
