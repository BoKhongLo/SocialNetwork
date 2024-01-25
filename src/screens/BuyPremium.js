import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

const BuyPremium = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [clickedMonths, setClickedMonths] = useState([false, false, false]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleBuyVnPay = () => {
    // You can implement the logic for handling the purchase here
    // For now, let's just show an alert
  };
  const handleBuyMomo = () => {
    // You can implement the logic for handling the purchase here
    // For now, let's just show an alert
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{ paddingVertical: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ height: 40, width: 40 }}
            source={require("../../assets/dummyicon/left_line_64.png")}
          />
        </TouchableOpacity>
        {/* <Text style ={paymentStyle.text}>Already subscribed</Text>
        <Text style ={paymentStyle.text}>Not yet subscribed</Text> */}
      </View>

      <View>
        <View>
          <View>
            <Text style={paymentStyle.title}>Get</Text>
            <Text style={paymentStyle.title}>Premium Access</Text>
          </View>
          <View
            style={{
              marginVertical: 20,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Month
              month={12}
              price={350}
              status={"vip"}
              isClicked={clickedMonths[0]}
              onPress={() => {
                const updatedClickedMonths = [...clickedMonths];
                updatedClickedMonths[0] = !clickedMonths[0];
                setClickedMonths(updatedClickedMonths);
              }}
            />
            <Month
              month={6}
              price={150}
              status={"normal"}
              isClicked={clickedMonths[1]}
              onPress={() => {
                const updatedClickedMonths = [...clickedMonths];
                updatedClickedMonths[1] = !clickedMonths[1];
                setClickedMonths(updatedClickedMonths);
              }}
            />
            <Month
              month={1}
              price={30}
              status={"normal"}
              isClicked={clickedMonths[2]}
              onPress={() => {
                const updatedClickedMonths = [...clickedMonths];
                updatedClickedMonths[2] = !clickedMonths[2];
                setClickedMonths(updatedClickedMonths);
              }}
            />
          </View>
        </View>
        <View>
          <View>
            <Text style={paymentStyle.title}>Why Premium ?</Text>
          </View>

          <Pack />
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 20,
            alignItems: "center",
            backgroundColor: "#009933",
            margin: 20,
            borderRadius: 30,
          }}
          onPress={toggleModal}
        >
          <Text style={[paymentStyle.text, { color: "white" }]}>Buy Now</Text>
        </TouchableOpacity>
        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={paymentStyle.modalContainer}>
            <View style={paymentStyle.modalContent}>
              <Text style={paymentStyle.modalTitle}>Confirm Purchase</Text>
              <Text style={paymentStyle.modalText}>Select payment method</Text>
              <TouchableOpacity
                style={paymentStyle.modalButton}
                onPress={() => {
                  toggleModal();
                  handleBuyVnPay();
                }}
              >
                <Image style={paymentStyle.logo} source={require('../../assets/img/VnPayLogo.png')}/>
                <Text style={paymentStyle.modalButtonText}>  VnPay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={paymentStyle.modalButton}
                onPress={() => {
                  toggleModal();
                  handleBuyMomo();
                }}
              >
                <Image style={paymentStyle.logo} source={require('../../assets/img/momoLogo.png')}/>
                <Text style={paymentStyle.modalButtonText}>  Momo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={paymentStyle.modalButton}
                onPress={toggleModal}
              >
                <Text style={paymentStyle.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const Month = ({ status, month, price, isClicked, onPress }) => {
  let backgroundColor, textColor, borderColor;

  if (status === "vip") {
    backgroundColor = "#222222";
    textColor = "white";
  } else if (status === "normal") {
    backgroundColor = "#FFCC99";
    textColor = "black";
  }

  if (isClicked) {
    borderColor = "#33FFFF";
  } else {
    borderColor = backgroundColor;
  }

  return (
    <TouchableOpacity
      style={[
        paymentStyle.month,
        { backgroundColor, borderWidth: 5, borderColor },
      ]}
      onPress={onPress}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={[paymentStyle.number, { color: textColor }]}>{month}</Text>
        <Text style={[paymentStyle.text, { color: textColor }]}>months</Text>
      </View>
      <Text style={[paymentStyle.text, { color: textColor }]}>{price}k</Text>
    </TouchableOpacity>
  );
};

const Pack = () => {
  return (
    <View style={paymentStyle.pack}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={paymentStyle.img}
          source={require("../../assets/dummyicon/attachment_2_line.png")}
        />
        <Text style={paymentStyle.textPack}>Send files with no limit</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={paymentStyle.img}
          source={require("../../assets/dummyicon/groupChat.png")}
        />
        <Text style={paymentStyle.textPack}>
          Unlimited members in your group
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={paymentStyle.img}
          source={require("../../assets/dummyicon/user.png")}
        />
        <Text style={paymentStyle.textPack}>Differentiated background</Text>
      </View>
    </View>
  );
};

const paymentStyle = StyleSheet.create({
  title: { fontSize: 40 },
  month: {
    height: 250,
    width: 120,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-around",
  },
  text: { fontSize: 20 },
  number: { fontSize: 30 },
  textPack: {
    fontSize: 28,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  pack: {
    margin: 10,
    height: 160,
  },
  img: {
    height: 40,
    width: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#009933",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
    alignItems: "center",
    flexDirection:'row',
    justifyContent:'center'
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  logo:{
    height:20,width:20
  }
});

export default BuyPremium;
