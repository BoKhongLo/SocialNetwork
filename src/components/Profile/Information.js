import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import profileStyle from '../../styles/profileStyles';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import styles from './../../styles/styles';
import { useNavigation } from '@react-navigation/native';

const Information = ({ data, isUser }) => {
  const navigation = useNavigation();
  return (
    <View style={{ alignItems: 'center' }}>
      <Image style={profileStyle.avatar} source={data.avatarUrl} />
      <Text style={{fontWeight: '400', fontSize: 25,    marginTop:10}}>{data.username}</Text>
      <Text style={{fontSize: 15,color:'grey',    marginTop:5 }}>{data.nickName}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop:10
        }}
      >
        <Pressable onPress={() => {
          if (!isUser) return;
          navigation.replace("listFriend", {data: {userId: data.id}})
          }}>
          <View style={profileStyle.numInfor}>
            {data.friends ? (
              <Text style={{ fontWeight: '400', fontSize: 20, marginRight: 5 }}>
                {data.friends.length}
              </Text>
            ) : (
              <Text style={{ fontWeight: '400', fontSize: 20, marginRight: 5 }}>
                0
              </Text>
            )}

            <Text style={{ fontWeight: '400' }}>Friends</Text>
          </View>
        </Pressable>
        <View>
          <Image
            style={{ height: 8, width: 8, marginTop: 10 }}
            source={require('../../../assets/dummyicon/dot.png')}
          />
        </View>
        <Pressable onPress={() => {
          if (!isUser) return;
          navigation.replace("listPost", {data: {userId: data.id}})
          }}>
          <View style={profileStyle.numInfor}>
            <Text style={{ fontWeight: '400', marginRight: 5 }}>Bookmark</Text>
            {data.bookMarks ? (
              <Text style={{ fontWeight: '400', fontSize: 20 }}>{data.bookMarks.length}</Text>
            ) : (
              <Text style={{ fontWeight: '400', fontSize: 20 }}>0</Text>
            )}

          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Information;