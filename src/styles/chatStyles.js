import { StyleSheet, fontWeight } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const chat = StyleSheet.create({
  container: {
    
  },
  videoContainer: {
    // flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  videoStyles: {
    alignSelf: 'center',
    width: 200,
    height: 150,
  },
  audioStyles: {
    alignSelf: 'center',
    width: 200,
    height: 90,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp("5%"),
    paddingTop: wp("2%"),
    alignItems:'center'
    // backgroundColor: 'black'
  },

  userNameStyles: {
    fontWeight: "700",
    fontSize: hp("3%"),

    // color: 'white',
  },

  createIcon: {
    height: 30,
    width: 30,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginTop: 3,
  },
  searchInput: {
    fontSize: 16,
    backgroundColor:'lightgrey',
    padding:15,
    borderRadius:30,
  },

  TinnhanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp("6%"),
  },
  TinnhanText: {
    paddingTop: hp("2%"),
    fontWeight: "700",
    fontSize: hp("2%"),
  },
  dangchoText: {
    paddingTop: hp("2%"),
    fontWeight: "300",
    fontSize: 12
  },

  chatUSerName: {
    fontWeight: "500",
  },
  avtChat: {
    width: 60,
    height: 60,
    borderRadius:50,
    borderWidth:0.8,
    borderColor:'black'
  },
  iconVideoCall:{
    marginTop:hp('2%'),
    width: 25,
    height: 25,
  },
  KhungChat:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5,
  },
  nameChatContainer:{
    paddingTop: hp('1%'),
    marginLeft: 5
  },
});

export default chat;
