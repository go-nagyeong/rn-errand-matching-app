import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,  Image, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown'

import Container from '../../components/Container';

export default InputPrice = (props ) => {
  const [price, setPrice] = useState("");
  
  const { category, content } = props.route.params;

  const priceList = [1000, 2000, 3000, 4000, 5000]

  return (
    <Container>
      <View style={styles.titleMargin}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{category}</Text>
          <Text style={styles.subTitle}>{content}</Text>
        </View>

        <View style={styles.inputWrapper}>
          <View style={{alignItems: "center", justifyContent: "center",}}>
            <SelectDropdown
              data={priceList}
              onSelect={(selectedItem, index) => {
                setPrice(selectedItem)
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
              }}
            />
          </View>
        </View>

        <View>
          <TouchableOpacity style={[{marginTop: 30, marginBottom: 100, alignItems: 'center', justifyContent: 'center'}]} onPress={() => { 
              if(price){
                props.navigation.navigate('WriteTitle', {category: category,price: price,}) 
              }
              else{
                alert("선택해 주세요.")
              }
            }}>
            <Image
              style = {styles.item}
              source={require('../../assets/img/Ok.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  titleMargin: {
    marginTop: "20%"
  },
  titleWrapper: {
    marginTop: Platform.OS === "ios" ? "10%" : "5%",
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: 'Roboto-Bold',
    color: 'black',
    fontSize: 24,
    padding: 10,
  },
  subTitle: {
    marginBottom: 20,
    fontFamily: 'Roboto',
    color: 'black',
    fontSize: 18,
    padding: 10,
  },
  inputWrapper: {
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  buttonWrapper: {
    paddingHorizontal: 35,
  },
  squareButton: {
    backgroundColor: '#53B77C',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 5,
  },
  squareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textButtonText: {
    color: "#53B77C",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    marginTop: "10%",
    alignItems: "center",
    justifyContent: "center",
    width: 50, 
    height: 50, 
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
      fontSize: 16,
      height: 50, 
      width: 250, 
      color: '#000000',
      borderColor: '#000000', 
      borderWidth: 1,
      borderRadius: 12,
      padding: 10
  },
  inputAndroid: {
      fontSize: 16,
      height: 50, 
      width: 250, 
      color: '#000000',
      borderColor: '#000000', 
      borderWidth: 1,
      borderRadius: 12,
      padding: 10
  },
});