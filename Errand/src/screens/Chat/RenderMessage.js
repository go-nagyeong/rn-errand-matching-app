import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Clipboard } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { MessageText, MessageImage } from 'react-native-gifted-chat';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'moment';

import * as Firebase from '../../utils/Firebase';
import Colors from '../../constants/Colors';

export default RenderMessage = (props) => {
    const { position, currentMessage, previousMessage, nextMessage, opponentImage } = props;

    const popoverButton = useRef(null);
    const [isReaded, setReaded] = useState(true)
    
    const currentMessageUser = currentMessage.user._id
    const currentMessageDate = Moment(currentMessage.createdAt).format('YYYY년 M월 D일 dddd')
    const currentMessageTime = Moment(currentMessage.createdAt).format('a h:mm')

    const previousMessageUser = Object.keys(previousMessage).length != 0
        ? previousMessage.user._id
        : null
    const previousMessageDate = Object.keys(previousMessage).length != 0 
        ? Moment(previousMessage.createdAt).format('YYYY년 M월 D일 dddd')
        : null
    const previousMessageTime = Object.keys(previousMessage).length != 0 
        ? Moment(previousMessage.createdAt).format('a h:mm')
        : null

    const nextMessageUser = Object.keys(nextMessage).length != 0 
        ? nextMessage.user._id
        : null
    const nextMessageTime = Object.keys(nextMessage).length != 0 
        ? Moment(nextMessage.createdAt).format('a h:mm')
        : null
    
    const isMyMessage = position == 'right'
    const isSameDate = currentMessageDate == previousMessageDate
    const isSameUser = (prevOrNext) => currentMessageUser == prevOrNext
    const isSameTime = (prevOrNext) => currentMessageTime == prevOrNext
    useEffect(() => {
        const unsubscribe = Firebase.chatsRef
            .doc(currentMessage._id)
            .onSnapshot(doc => {
                if (doc.exists) {
                    if (doc.data().isRead == 1) {
                        setReaded(true)
                    } else {
                        setReaded(false)
                    }
                }
            })
        return unsubscribe
    }, [])


    const renderDay = () => (
        !isSameDate &&
            <View style={styles.messageDay}>
                <View style={styles.textLine} />
                <Text style={styles.day}>{currentMessageDate}</Text>
                <View style={styles.textLine} />
            </View>
    )
    
    const renderAvatar = () => {
        return (
            !isMyMessage &&
                <Avatar
                    source={!isSameUser(previousMessageUser) || !isSameTime(previousMessageTime) ? { uri: opponentImage } : null}
                    containerStyle={[styles.messageAvatar]}
                />
        )
    }

    const renderBubble = () => (
        <View style={[styles.messageBubble, isMyMessage && {flexDirection: 'row-reverse'}]}>
            <View style={{maxWidth: '86%'}}>
                <Tooltip
                    ref={popoverButton}
                    withOverlay={false}
                    skipAndroidStatusBar={true}
                    backgroundColor={Colors.black}
                    width={80}
                    height={36}
                    toggleAction='onLongPress'
                    popover={
                        <TouchableOpacity onPress={() => {
                            Clipboard.setString(currentMessage.text)
                            popoverButton.current.toggleTooltip()
                        }}>
                            <Text style={{fontSize: 14, color: Colors.white}}>
                                복사하기
                            </Text>
                        </TouchableOpacity>
                    }
                >
                    <LinearGradient style={styles.bubble} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} colors={[Colors.linearGradientLeft, Colors.linearGradientRight]}>
                        {currentMessage.image &&
                            <MessageImage
                                {...props}
                                imageStyle={{margin: 0}}
                                containerStyle={{backgroundColor: Colors.white}}
                            />
                        || currentMessage.text &&
                            <MessageText
                                {...props}
                                containerStyle={{
                                    left: [styles.bubble, {padding: 2, backgroundColor: '#f1f1f1'}],
                                    right: [styles.bubble, {padding: 2}]
                                }}
                            />
                        }
                    </LinearGradient>
                </Tooltip>
            </View>

            <View style={{justifyContent: 'flex-end'}}>
                <Text style={styles.readState}>{!isReaded ? '안읽음' : null}</Text>
                <Text style={styles.time}>
                    {isSameUser(nextMessageUser) && isSameTime(nextMessageTime)
                        ? null : currentMessageTime
                    }
                </Text>
            </View>
        </View>
    )

    const marginBottom = isSameUser(nextMessageUser) ? (isSameTime(nextMessageTime) ? 2 : 8) : 18

    return (
        <View style={styles.container}>
            {renderDay()}
            <View style={[styles.wrap, {marginBottom}, isMyMessage && {flexDirection: 'row-reverse'}]}>
                {renderAvatar()}
                {renderBubble()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
    },
    wrap: {
        flexDirection: 'row',
        marginBottom: 6,
    },

    messageDay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    textLine: {
        flex: 1,
        backgroundColor: Colors.gray,
        height: StyleSheet.hairlineWidth,
    },
    day: {
        fontSize: 12,
        color: Colors.gray,
        marginHorizontal: 6,
    },

    messageAvatar: {
        overflow: 'hidden',
        height: 38,
        width: 38,
        borderRadius: 14,
        marginRight: 8,
    },

    messageBubble: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    bubble: {
        borderRadius: 16,
    },
    time: {
        fontSize: 11,
        color: Colors.midGray,
        marginHorizontal: 4,
    },
    readState: {
        fontSize: 11,
        color: Colors.darkGray2,
        marginHorizontal: 4,
        textAlign: 'right',
        marginBottom: 4,
    }
})