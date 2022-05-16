import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, View, Text, TouchableOpacity, Image } from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import Moment from 'moment';
import 'moment/locale/ko';
import { useNavigation } from '@react-navigation/native';

import Colors from '../../constants/Colors';
import * as Firebase from '../../utils/Firebase';

export default RenderItem = ({ item, notification }) => {
    const navigation = useNavigation()

    const id = item.post.split('%')[0];
    const writerEmail = item.post.split('%')[1];
    const erranderEmail = writerEmail === item.user._id ? item.opponent._id : item.user._id;
    const [errandInfo, setErrandInfo] = useState(null)

    useEffect(() => {
        Firebase.postsRef
            .doc(item.post)
            .get()
            .then(doc => {
                if (doc.exists) {
                    setErrandInfo(doc.data())
                }
            })
    }, [])    

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Chat", {id: id, writerEmail: writerEmail, erranderEmail: erranderEmail, errandInfo: errandInfo})}>  
            <View style={styles.itemView}>
                <View style={{flexDirection: 'row', width: '65%'}}>
                    <Avatar
                        size={50}
                        rounded
                        source={{ uri: item.chatImage }}
                        containerStyle={{ marginRight: 10 }}
                    />

                    <View style={{flexDirection: 'column'}}>
                        <Text style={{includeFontPadding: false, fontSize: 15, fontWeight: '600', color: Colors.black, marginBottom: 7}} numberOfLines={1} ellipsizeMode="tail">
                            {item.chatTitle}
                        </Text>
                        <Text style={{includeFontPadding: false, fontSize: 14, color: Colors.gray}} numberOfLines={2} ellipsizeMode="tail">
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
                        {/* {Moment(item.createdAt)} */}
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