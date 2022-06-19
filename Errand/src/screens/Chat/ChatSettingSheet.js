import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import storage from '@react-native-firebase/storage';

import * as Firebase from '../../utils/Firebase';
import { useNavigation } from '@react-navigation/native';

export default ChatSettingSheet = (props) => {
    const { actionSheet, bannerAlwaysVisible, setBannerAlwaysOption, errandInfo } = props;

    const navigation = useNavigation()

    return (
        bannerAlwaysVisible
        ?
        <ActionSheet
            ref={actionSheet}
            options={['게시물 상세보기', '닫기']}
            cancelButtonIndex={1}
            onPress={(index) => {
                if (index == 0) {
                    navigation.navigate("ShowDetailPost", {...errandInfo});
                }
            }}
        />
        :
        <ActionSheet
            ref={actionSheet}
            options={['배너 항상 끄기 옵션 해제', '게시물 상세보기', '취소']}
            cancelButtonIndex={2}
            onPress={(index) => {
                if (index == 0) {
                    setBannerAlwaysOption(true)
                } else if (index == 1) {
                    navigation.navigate("ShowDetailPost", {...errandInfo});
                }
            }}
        />
    )
}