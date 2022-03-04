import React, { useState } from 'react'
import { Text, View, Button, Modal, SafeAreaView } from 'react-native'
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures'


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
  const {reportDetailVisible, setReportDetailVisible, opponentEmail, opponentNickname} = props;
  const navigation = useNavigation();
  
  // 항목 선택 유무 판단 method
  const checkItem = (selectedItem) => { 
    // 선택 0
    if (Object.keys(selectedItem) != false) { 
      return selectedItem['id'];
    }
    // 선택 X
    alert('신고내용을 선택해주세요')
    return false;
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
      console.log('신고 횟수가 수정되었습니다')
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
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeDown={() => {setReportDetailVisible(false)}}>
        <Modal
          visible={reportDetailVisible}
          onRequestClose={() => {setReportDetailVisible(false);}}
          animationType={'fade'}
          // statusBarTranslucent={true} // 상태창 투명
          >
          <View style={{ margin: 30 }}>
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
              onPress={() => {
                if (checkItem(selectedTeam) !== false) { // 선택 유무 파악
                  update(checkItem(selectedTeam), opponentEmail); // 신고 함수
                  navigation.reset({routes: [{name:'Mypage'}]}) // 뒤로가기 못하도록, 마이페이지 이동
                }
              }}
            /> 
          </View>
        </Modal>
      </GestureRecognizer>
    </SafeAreaView>
  )
}

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