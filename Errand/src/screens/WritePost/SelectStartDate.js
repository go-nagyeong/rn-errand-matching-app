import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {LocaleConfig, Calendar} from 'react-native-calendars';

import Container from '../../components/Container';

export default SelectStartDate = (props) => {
  const { category, price, title, content, uploadUri } = props.route.params;

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'jan',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };
  LocaleConfig.defaultLocale = 'fr';


  var now = new Date()

  const year = now.getFullYear()
  const month = now.getMonth()+1 > 9 ? now.getMonth() +1 : "0" + (now.getMonth() +1)
  const day = now.getDate() > 9 ? now.getDate() : "0" + (now.getDate())
  const current = year + "-" + month + "-" + day

  var [startDate, setStartDate] = useState();
  var [endDate, setEndDate] = useState();

  const [markedDates, setMarkedDates] = React.useState(null);


  const user = auth().currentUser;
  const users = firestore().collection('Users')
  const posts = firestore().collection('Posts')
  const [userGrade, setUserGrade] = useState();
  const [docID, setDocID] = useState('')

  useEffect(() => {
    users
    .where('nickname', '==', user.displayName)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        setUserGrade(doc.data()["grade"])
      })
    })

    posts
    .doc('doc_id')
    .onSnapshot(doc => {
      setDocID(doc.data()['incrementID'])
    })
  }, []);
  

  const addPostData = () => {
    if(startDate) {
      var id = docID.toString();

      posts
      .doc(id)
      .set({
        id: docID,
        category: category,
        price: price,
        title: title,
        content: content,
        date: new Date(startDate),
        endDate: new Date(endDate),
        writer: user.displayName,
        writerEmail: user.email,
        writerGrade: userGrade,
        process: "regist", // regist > request > matching > finished
        errander: "",
        erranderEmail: ""
      })
      .then(() => {
          const increment = firestore.FieldValue.increment(1);
          posts.doc('doc_id').update({ incrementID: increment });
  
          props.navigation.navigate("Home")
          console.log('post added!');
      })
      .catch(error => {console.error(error);})

      storage()
      .ref('Posts/'+ id)
      .putFile(uploadUri)
      .on('state_changed', taskSnapshot => {
          console.log(taskSnapshot.state);
      })

    } else {
      alert("선택해 주세요.")
    }
  }

  
  function addDates(date) {
    let obj = date.reduce(
      (c, v) =>
        Object.assign(c, {
        [v]: { selected: true },
        }),
      {},
    );
    setMarkedDates(obj);
  }

  return (
    <Container>
      <View style={styles.titleMargin}>
        <View style={styles.titleWrapper}>
            <Text style={styles.title}>종료 날짜</Text>
            <Text style={styles.subTitle}>종료되는 날짜를 정해주세요.</Text>
        </View>

        <View style={styles.inputWrapper}>
          <Calendar
            minDate={current}
            onDayPress={day => {
                setStartDate(Date.parse(new Date()))
                setEndDate(Date.parse(day["dateString"].split('-').join('/') + ' 00:00:00'))
                addDates([day["dateString"]]);
            }}
            markedDates={markedDates}
          />

          <TouchableOpacity style={[{marginTop: 30, marginBottom: 100, alignItems: 'center', justifyContent: 'center'}]}
            onPress={() => addPostData()}>
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
    marginTop: "5%"
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
    marginBottom: 0,
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
  focusedInput: {
    backgroundColor: "#fff",
    marginBottom: 12,
    fontWeight: "600",
    borderRadius: 7,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {width: 6, height: 3},
      },
      android: {
        elevation: 6,
      },
    })
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
    width: 300, 
    color: '#000000',
    borderColor: '#000000', 
    borderRadius: 12,
    padding: 10
  },
  inputAndroid: {
    fontSize: 16,
    height: 50, 
    width: 300, 
    color: '#000000',
    borderColor: '#000000', 
    borderRadius: 12,
    padding: 10
  },
});