import React from 'react';
import { View, Text, Image, } from 'react-native';
import profileStyle from '../../styles/profileStyles';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Information = ({ data }) => {
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
        <View style={profileStyle.numInfor}>
          <Text style={{ fontWeight: '400', fontSize: 20, marginRight: 5 }}>
            {data.friends.length}
          </Text>
          <Text style={{ fontWeight: '400' }}>Friends</Text>
        </View>
        <View>
          <Image
            style={{ height: 8, width: 8, marginTop: 10 }}
            source={require('../../../assets/dummyicon/dot.png')}
          />
        </View>
        <View style={profileStyle.numInfor}>
          <Text style={{ fontWeight: '400', marginRight: 5 }}>Bookmark</Text>
          <Text style={{ fontWeight: '400', fontSize: 20 }}>{data.posted}</Text>
        </View>
      </View>
    </View>
  );
};

export default Information;