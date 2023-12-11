import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import { AspectRatio } from "native-base";
const Example = () => (
  <View>
    <AspectRatio
      ratio={{ base: 16 / 9, md: 10 / 10 }}
      height={{ base: 250, md: 400 }}
      style={{ justifyContent: "center" }}
    >
      <Image
        resizeMode="cover"
        source={{
          uri: "https://images.pexels.com/photos/60597/dahlia-red-blossom-bloom-60597.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        }}
        alt="Picture of a Flower"
      />
    </AspectRatio>
  </View>
);

const data = [
  {
    key: "1",
    username: "sieunhangao",
    imageUrl:
      "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?b=1&s=612x612&w=0&k=20&c=OZCJVUTzN3FKKty8kpLsDqufL8zkxHh11fhHl-kwlPM=",
    content: "This is the first post.",
  },
  {
    key: "2",
    username: "sieunhangao",
    imageUrl:
      "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?b=1&s=612x612&w=0&k=20&c=OZCJVUTzN3FKKty8kpLsDqufL8zkxHh11fhHl-kwlPM=",
    content: "This is the first post.",
  },
  {
    key: "2",
    username: "sieunhangao",
    imageUrl:
      "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?b=1&s=612x612&w=0&k=20&c=OZCJVUTzN3FKKty8kpLsDqufL8zkxHh11fhHl-kwlPM=",
    content: "This is the first post.",
  },
  {
    key: "2",
    username: "sieunhangao",
    imageUrl:
      "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?b=1&s=612x612&w=0&k=20&c=OZCJVUTzN3FKKty8kpLsDqufL8zkxHh11fhHl-kwlPM=",
    content: "This is the first post.",
  },
  {
    key: "2",
    username: "sieunhangao",
    imageUrl:
      "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?b=1&s=612x612&w=0&k=20&c=OZCJVUTzN3FKKty8kpLsDqufL8zkxHh11fhHl-kwlPM=",
    content: "This is the first post.",
  },
  {
    key: "2",
    username: "sieunhangao",
    imageUrl:
      "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?b=1&s=612x612&w=0&k=20&c=OZCJVUTzN3FKKty8kpLsDqufL8zkxHh11fhHl-kwlPM=",
    content: "This is the first post.",
  },
];

const PostComponent = ({ username, imageUrl, content }) => (
  <View style={{ alignItems: "flex-start", marginHorizontal: 10 }}>
    <Text style={{ color: "black" }}>{username}</Text>
    <Image
      style={{ width: "auto", height: "auto", borderRadius: 2 }} // Thay thế bằng kích thước thực của ảnh
      source={{ uri: imageUrl }}
    />
    <Text style={{ color: "black" }}>{content}</Text>
  </View>
);

const YourComponent = () => {
  const renderItem = ({ item }) => (
    // <PostComponent
    //   username={item.username}
    //   imageUrl={item.imageUrl}
    //   content={item.content}
    // />,
    <Example />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      vertical
      showsVerticalScrollIndicator={true}
      // showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ marginBottom: 13, justifyContent: "center" }}
    />
  );
};

export default YourComponent;
