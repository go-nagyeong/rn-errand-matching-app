import React, { useState } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

import { Downward, Upward } from '../../components/Chevron'
import Question from '../../components/QuestionIcon'

import Accordion from 'react-native-collapsible/Accordion';

import Colors from '../../constants/Colors'

export default FaqScreen = () => {
  const SECTIONS = [
    {
      id: 0,
      title: "'안동대 심부름'은 어떤 서비스인가요?",
      content: "'안동대 심부름'은 안동대 학생을 대상으로 한 믿을 수 있는 심부름 대행 플랫폼이에요. 사용자는 '안동대 심부름'을 통해 심부름꾼으로부터 생활 속 불편함을 해결하고, 심부름꾼은 작성자의 요청사항을 수행함으로써 보람을 느끼며 수익을 창출할 수 있어요.",
    },
    {
      id: 1,
      title: "(심부름꾼) 심부름은 어떻게 요청할 수 있나요?",
      content: "게시글 내의 <심부름 요청하기> 버튼을 클릭하여 심부름꾼이 심부름을 요청할 수 있어요",
    },
    {
      id: 2,
      title: "작성자, 심부름꾼 간에 채팅을 할 수 있나요?",
      content: "네. 심부름 매칭 전에도 1:1 채팅을 통해 서로 대화를 할 수 있어요."
    },
    {
      id: 3,
      title: "심부름꾼과 매칭된 후 연락도 되지 않고 \n수행하지 않는데 어떡하나요?",
      content: "[마이페이지 > 1:1 문의하기]를 통해 고객센터에 즉각 신고해 주세요. 경위 확인 후 해당 심부름꾼/작성자는 즉시 활동 정지 조치되어요."
    },
    {
      id: 4,
      title: "회원 탈퇴는 어떻게 하나요?",
      content: "[마이페이지 > 회원정보 설정 > 탈퇴하기]에서 가능해요. 탈퇴 시 모든 개인 정보는 즉시 파기되어요."
    },
    {
      id: 5,
      title: "어떤 경우에 서비스 이용이 정지되나요?",
      content: "서비스 이용이 정지되는 경우는 다음과 같아요\n\n - 다수의 작성자/심부름꾼으로부터 신고가 접수될 경우\n - 대리처방, 애인대행, 미행, 돈 빌리기 등 불건전하거나 불법적인 심부름/서비스를 요청할 경우\n - 작성자/심부름꾼에게 반말, 욕설 등 부적절한 언어를 사용할 경우 - 그 외 '안동대 심부름'의 규정을 위반하거나 법을 위반할 경우"
    },
    {
      id: 6,
      title: "담배 또는 주류 배달도 가능한가요?",
      content: "고객이 만 19세 이상 성인이라면 가능해요. 단, 청소년 보호법 제28조에 따라 성인 여부를 고객의 신분증을 통해 직접 확인하고, 신분증 노출을 꺼려 한다면 '안동대 심부름'고객센터에 즉각 신고해 주세요. 신분증은 주민등록증, 운전면허증, 여권만 가능해요. 신분증 정보는 다른 용도로 절대 활용되면 안 돼요."
    },
  ];
  const [state, setState] = useState([]);
  
  // 제목
  const _renderHeader = (section) => {
    return (
      <View style={styles.setting}>
        {/* Q 아이콘 추가 */}
        <Question/>
        <Text style={{includeFontPadding: false, paddingLeft: 10, fontWeight: '500', fontSize: 15, color: Colors.black, textAlign: 'left', flex: 1}}>
          {section.title}
        </Text>
        {section.id == state[0] ? <Upward/> : <Downward/>}
      </View>
    );
  };
  // 내용
  const _renderContent = (section) => {
    return (
      <View style={styles.content}>
        <Text style={{fontSize: 14}}>
          {section.content}
        </Text>
      </View>
    );
  };
  const _updateSections = (activeSections) => {
    setState(activeSections);
  };

  return (
  <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>FAQ</Text>
      </View> */}
      {/* FAQ 리스트 */}
      <ScrollView>
        <Accordion
          // renderSectionTitle={_renderSectionTitle} // 섹션
          sections={SECTIONS}
          activeSections={state}

          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </ScrollView>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  setting: {
    backgroundColor: Colors.white,
    padding: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    padding: 20,
    backgroundColor: Colors.lightGray,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: '700',
  },
})