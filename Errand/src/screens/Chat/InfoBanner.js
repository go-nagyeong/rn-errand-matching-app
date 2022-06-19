import React from 'react';
import { Banner } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import Moment from 'moment';

import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';

export default InfoBanner = (props) => {
    const { errandInfo, bannerVisible, bannerVisibleIsFalse, bannerAlwaysVisible, setBannerAlwaysOption } = props;

    return (
        <Banner
            visible={bannerAlwaysVisible && bannerVisible}
            contentStyle={styles.banner}
            actions={[
                {
                    label: '끄기',
                    color: Colors.black,
                    onPress: () => bannerVisibleIsFalse(),
                },
                {
                    label: '항상 끄기',
                    color: Colors.black,
                    style: {justifyContent: 'center'},
                    onPress: () => {setBannerAlwaysOption(false); bannerVisibleIsFalse()},
                },
            ]}
        >   
            <View style={styles.bannerView}>
                <Text style={styles.process}>
                    심부름 상태: {errandInfo.process.title === 'request' && '요청'
                    || errandInfo.process.title === 'matching' && '매칭'
                    || errandInfo.process.title === 'finishRequest' && '완료 요청'
                    || errandInfo.process.title === 'finish' && '완료'
                    }
                </Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={styles.leftWrap}>
                        <Text style={styles.title} numberOfLines={2}>{errandInfo.title}</Text>

                        {errandInfo.matchingTime && 
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.duration}>심부름 </Text>
                                <Text style={[styles.duration, {color: Colors.red, fontWeight: '500'}]}>{Moment(errandInfo.matchingTime.toDate()).fromNow().replace(' 전','')}</Text>
                                <Text style={styles.duration}> 경과</Text>
                            </View>
                        }
                    </View>

                    {(errandInfo.destination || errandInfo.arrive) &&
                        <View style={styles.rightWrap}>
                            <View style={{alignItems: 'center', marginRight: 5}}>
                                <FIcon name='map-pin' size={18} color={Colors.black} style={styles.locationIcon} />
                                <FIcon name='minus' size={16} color={Colors.black} style={[styles.locationIcon, {transform: [{rotate: '90deg'}]}]} />
                                <FIcon name='flag' size={18} color={Colors.black} style={styles.locationIcon} />
                            </View>
                            <View style={{width: '82%'}}>
                                <Text style={styles.locationText} numberOfLines={1}>{errandInfo.destination}</Text>
                                <Text style={styles.locationText}> </Text>
                                <Text style={styles.locationText} numberOfLines={1}>{errandInfo.arrive}</Text>
                            </View>
                        </View>
                    || null
                    }
                </View>
            </View>
        </Banner>
    )
}

const styles = StyleSheet.create({
    banner: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.midGray,
    },
    bannerView: {
        width: Common.width-32,
    },
    process: {
        fontSize: 16,
        color: Colors.gray,
        marginBottom: 6,
    },
    leftWrap: {
        width: (Common.width-32)*0.56,
        marginRight: (Common.width-32)*0.04,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 12,
        color: Colors.black,
    },
    duration: {
        fontSize: 15,
        color: Colors.darkGray,
    },

    rightWrap: {
        flexDirection: 'row',
        borderWidth: 0.8,
        borderColor: Colors.gray,
        padding: 12,
        borderRadius: 10,
        width: (Common.width-32)*0.4,
    },
    locationIcon: {
        lineHeight: 18,
    },
    locationText: {
        fontSize: 15,
        lineHeight: 18,
        color: Colors.black,
    }
})