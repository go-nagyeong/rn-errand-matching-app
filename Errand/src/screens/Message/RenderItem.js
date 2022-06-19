import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Image } from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';

export default RenderItem = ({item, notification}) => {
    const navigation = useNavigation()

    // Chat 전달 파라미터
    const [errandInfo, setErrandInfo] = useState(null)
    
    // 채팅 타이틀, 사진
    const [chatImage, setChatImage] = useState('')
    const [chatTitle, setChatTitle] = useState('')

    useEffect(() => {
        Firebase.postsRef
            .doc(item.post)
            .get()
            .then(doc => {
                if (doc.exists) {
                    setErrandInfo(doc.data())
                }
            })

        // 실시간 반영 안됨
        Firebase.usersRef
            .doc(item.opponentEmail)
            .get()
            .then(doc => {
              if (doc.exists) {
                setChatImage(doc.data().image)
                setChatTitle(doc.data().nickname)
              }
            })
    }, [])

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Chat", {item: errandInfo})}>  
            <View style={styles.itemView}>
                <View style={{flexDirection: 'row', width: '64%'}}>
                    {chatImage
                        ?
                        <Avatar
                            size={52}
                            rounded
                            source={{ uri: chatImage }}
                            containerStyle={{ marginRight: 12 }}
                        />
                        :
                        <Avatar
                            size={52}
                            rounded
                            icon={{ name: 'user-alt', type: 'font-awesome-5', size: 26 }}
                            containerStyle={{ marginRight: 12, backgroundColor: Colors.lightGray2 }}
                        />
                    }

                    <View style={{flexDirection: 'column', marginTop: 2}}>
                        <Text style={{fontSize: 16, fontWeight: '600', color: Colors.black, marginBottom: 8}} numberOfLines={1} ellipsizeMode="tail">
                            {chatTitle}
                        </Text>
                        <Text style={{fontSize: 15, lineHeight: 19, color: Colors.gray}} numberOfLines={2} ellipsizeMode="tail">
                            {item.text !== "" ? item.text : '(사진)'}
                        </Text>
                    </View>
                </View>

                <View style={{justifyContent: 'flex-end'}}>
                    {notification &&
                        <View style={{marginBottom: 8, alignItems: 'flex-end'}}>
                            <Badge value={notification} status="error" />
                        </View>
                    }
                    <Text style={{fontSize: 13, color: Colors.midGray}}>
                        {Moment(item.createdAt.toDate()).diff(Moment(), 'days') >= -2
                            ? Moment(item.createdAt.toDate()).fromNow()
                            : Moment(item.createdAt.toDate()).format('YY/MM/DD')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>  
       
    );
}

const styles = StyleSheet.create({
    itemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.lightGray2,
    },
})