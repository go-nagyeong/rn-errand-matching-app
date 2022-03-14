import React, { useState } from 'react'
import { Text, View, Button, Modal, SafeAreaView, StyleSheet, Alert } from 'react-native'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';


const K_OPTIONS = [{
    item: '성희롱을 해요',
    id: '성희롱',
  },
  {
    item: '비매너 사용자예요',
    id: '비매너',
  },
  {
    item: '욕설을 해요',
    id: '욕설',
  },
  {
    item: '사기 사용자예요',
    id: '사기',
  },
  {
    item: '연애 목적의 대화를 시도해요',
    id: '연애목적',
  },
]

const ReportDetail = (props) => {
  const [selectedTeam, setSelectedTeam] = useState({})
  const {reportDetailVisible, setReportDetailVisible, opponentEmail, opponentNickname, postId} = props;
  const navigation = useNavigation();

  // 항목 선택 유무 판단 method
  const checkItem = (selectedItem) => { 
    const doc = postId.toString() + 'omg'
    firestore()
    .collection('Posts')
    .doc(doc)
    .get()
    .then(documentSnapshot => {
        if (documentSnapshot.data()['reported']) {
          // 중복 신고 여부 검사
          if (documentSnapshot.data()['reported'].includes(auth().currentUser.email)) {
            console.log('이미 신고하였습니다');
            // Alert.alert('이미 신고하였습니다');
            return false;
          } else {
            // 신고 항목 선택 여부 검사
            if (Object.keys(selectedItem) != false) { 
              update(selectedItem['id'], opponentEmail); // 신고 함수
              navigation.reset({routes: [{name:'Mypage'}]}) // 뒤로가기 못하도록, 마이페이지 이동
            } else {alert('신고내용을 선택해주세요');}
          }
        } else {
          console.log('reported 속성을 가져오지 못했습니다. reported 속성을 새로 생성합니다')
          firestore()
          .collection('Posts')
          .doc(doc)
          .update({
            reported: firestore.FieldValue.arrayUnion(), // 신고한 유저 리스트에 자신의 이메일 추가
          })
        }
      })
      .catch(error => console.log('checkItem에서 오류 발생', error))

    // 신고완료하면 게시글에 자신의 이메일을 신고한 유저 property에 추가
    // firestore()
    // .collection('Posts')
    // .doc(doc)
    // .update({
    //   reported: firestore.FieldValue.arrayUnion(auth().currentUser.email), // 신고한 유저 리스트에 자신의 이메일 추가
    // })
    // .then(() => {

      
    // })

  }
  
  // 신고 로직(All) (get data from firestore + update data to firestore)
  const update = (selectedItem, email) => { // 신고
    firestore()
    .collection('Users')
    .doc(email)
    .get()
    .then((documentSnapshot) => {
      let reportCnt_0 = documentSnapshot.data()['data'][K_OPTIONS[0].id]; // 성희롱
      let reportCnt_1 = documentSnapshot.data()['data'][K_OPTIONS[1].id]; // 비매너
      let reportCnt_2 = documentSnapshot.data()['data'][K_OPTIONS[2].id]; // 욕설
      let reportCnt_3 = documentSnapshot.data()['data'][K_OPTIONS[3].id]; // 사기
      let reportCnt_4 = documentSnapshot.data()['data'][K_OPTIONS[4].id]; // 연애 목적
      
      switch (selectedItem) {
        case('성희롱') : reportCnt_0++; break;
        case('비매너') : reportCnt_1++; break;
        case('욕설') : reportCnt_2++; break;
        case('사기') : reportCnt_3++; break;
        case('연애목적') : reportCnt_4++; break;
      }
      updateReportCount(email, reportCnt_0, reportCnt_1, reportCnt_2, reportCnt_3, reportCnt_4) // 비동기라 then에서 작업 필요
    })
    .catch((err => {
      console.log('report_cnt 값을 가져오는데 실패하였습니다 : ', err)
    }))
  }

  // 신고 로직 (firestore에 업데이트)
  const updateReportCount = (email, reportCnt_0, reportCnt_1, reportCnt_2, reportCnt_3, reportCnt_4) => {
    let data = {
      '성희롱' : reportCnt_0,
      '비매너' : reportCnt_1,
      '욕설' : reportCnt_2,
      '사기' : reportCnt_3,
      '연애목적' : reportCnt_4,
    }
    console.log(data) // firestore에서 데이터 가져온것 확인
    
    firestore()
    .collection('Users')
    .doc(email)
    .update({
      data
    })
    .then(() => {
      const doc = postId.toString() + 'omg'
      console.log('신고 횟수가 수정되었습니다')
      firestore()
        .collection('Posts')
        .doc(doc)
        .update({
          reported: firestore.FieldValue.arrayUnion(auth().currentUser.email), // 신고한 유저 리스트에 자신의 이메일 추가
        })
        .then(() => console.log('이제 다시 신고할 수 없습니다'))
    })
    .catch(((err) => {
      console.log('신고 횟수 추가에 실패하였습니다 : ', err)
    }))
  }
  
  function onChange() {
    return (val) => {setSelectedTeam(val);}
  }

  return (
    <SafeAreaView>
      <Modal
        visible={reportDetailVisible}
        onRequestClose={() => {setReportDetailVisible(false);}}
        animationType={'fade'}
        // statusBarTranslucent={true} // 상태창 투명
        >
        <View 
          style={styles.background}
          onStartShouldSetResponder={() => {setReportDetailVisible(false);}}
        ></View>
        {/* margin: 30 */}
        <View style={styles.content}> 
          <Text>{opponentNickname}님을 신고합니다</Text>
          <Text style={{ fontSize: 20, paddingBottom: 10 }}>신고 내용</Text>

          <SelectBox
            label=""
            options={K_OPTIONS}
            value={selectedTeam}
            onChange={onChange()}
            hideInputFilter={false}
          />

          <Button 
            title={'신고하기'} 
            onPress={() => { checkItem(selectedTeam); }}
          /> 
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transparent: true,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
    // backgroundColor: '#00000080',
  },
  content: {
    width: 400, // 기기 별 사이즈 조정 필요
    height: 300, // 기기 별 사이즈 조정 필요
    backgroundColor: '#fff', padding: 20,
  }
})

export default ReportDetail

// 다중 선택 Select Box

// const onMultiChange = () => {
//   return (item) => {setSelectedTeams(xorBy(selectedTeams, [item], 'id')); console.log("item : ", item, "selectedTeams : ", selectedTeams)}
// }
// const [selectedTeams, setSelectedTeams] = useState([])

{/* <SelectBox
  label="선택하세요"
  options={K_OPTIONS}
  selectedValues={selectedTeams}
  onMultiSelect={onMultiChange()}
  onTapClose={onMultiChange()}
  isMulti
/> */}



{/* 단일 선택 select Box */}

// function onChange() {
  //   return (val) => setSelectedTeam(val)
// }
{/* <View style={{ width: '100%', alignItems: 'center' }}>
  <Text style={{ fontSize: 30, paddingBottom: 20 }}>Demos</Text>
</View>
<Text style={{ fontSize: 20, paddingBottom: 10 }}>Select Demo</Text>
<SelectBox
  label="Select single"
  options={K_OPTIONS}
  value={selectedTeam}
  onChange={onChange()}
  hideInputFilter={false}
/>
<View style={{ height: 40 }} /> */}