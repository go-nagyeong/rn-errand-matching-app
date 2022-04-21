import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import storage from '@react-native-firebase/storage';

import * as Firebase from '../../utils/Firebase';
import { useNavigation } from '@react-navigation/native';

export default ChatSettingSheet = (props) => {
    const { actionSheet, postId, bannerAlwaysVisible, setBannerAlwaysOption } = props;

    const navigation = useNavigation()

    const deleteChat = () => {
        Alert.alert(
            "채팅방 나가기",
            "채팅방을 나가면 채팅 목록 및 대화 내용이 삭제되고 복구가 불가능합니다.\n정말 나가시겠습니까?",
            [{
              text: "취소",
              style: "cancel",
            },
            {
              text: "나가기",
              onPress: async () => {
                // 채팅 삭제 (storage에 있는 이미지 & 폴더)
                await storage()
                    .ref('Chats/' + postId)
                    .listAll()
                    .then(dir => {
                        dir.items.forEach(fileRef => {
                            storage()
                                .ref(fileRef.path)
                                .delete()
                                .then(() => console.log('성공'))
                        })
                        
                    })
                    .catch(err => console.log(err));

                // 채팅 삭제 (firestore에 있는 텍스트)
                Firebase.chatsRef
                    .where('post', '==', postId)
                    .get()
                    .then(async querySnapshot => {
                        for await (const doc of querySnapshot.docs) {
                            await doc.ref.delete()
                        }
                        navigation.goBack()
                    })
                    .catch(err => console.log(err));
              },
              style: "destructive",
            }],
        )
    }

    return (
        bannerAlwaysVisible
        ?
        <ActionSheet
            ref={actionSheet}
            options={['게시물 상세보기', '채팅방 나가기', '취소']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => {
                if (index == 0) {
                    // navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName : item.writer, writergrade : writerGrade, price : item.price, email : item.writerEmail, id : item.id, image: item.image, writerImage: writerImage, views: item.views});
                } else if (index == 1) {
                    deleteChat();
                }
            }}
        />
        :
        <ActionSheet
            ref={actionSheet}
            options={['배너 항상 끄기 옵션 해제', '게시물 상세보기', '채팅방 나가기', '취소']}
            cancelButtonIndex={3}
            destructiveButtonIndex={2}
            onPress={(index) => {
                if (index == 0) {
                    setBannerAlwaysOption(true)
                } else if (index == 1) {
                    // navigation.navigate("ShowDetailPost", {title: item.title, content: item.content, writerName : item.writer, writergrade : writerGrade, price : item.price, email : item.writerEmail, id : item.id, image: item.image, writerImage: writerImage, views: item.views});
                } else if (index == 2) {
                    deleteChat();
                }
            }}
        />
    )
}