import React from 'react';
import { Banner } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';

import Colors from '../../constants/Colors';

export default InfoBanner = (props) => {
    const { postId, errandInfo, bannerVisible, bannerVisibleIsFalse, bannerAlwaysVisible, setBannerAlwaysOption } = props;

    return (
        <Banner
            visible={bannerAlwaysVisible && bannerVisible}
            style={styles.banner}
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
            <View>
                <Text style={styles.process}>
                    심부름 상태: {errandInfo.process.title === 'request' && '요청'
                    || errandInfo.process.title === 'matching' && '매칭'
                    || errandInfo.process.title === 'finishRequest' && '완료 요청'
                    || errandInfo.process.title === 'finish' && '완료'
                    }
                </Text>

                <Text style={styles.title}>{errandInfo.title}</Text>

                {(errandInfo.destination || errandInfo.arrive) &&
                    <View style={styles.locationWrap}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FIcon name='map-pin' size={20} />
                            <Text style={styles.location}>{errandInfo.destination}</Text>
                        </View>
                        <FIcon name='more-vertical' size={20} />
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FIcon name='flag' size={20} />
                            <Text style={styles.location}>{errandInfo.arrive}</Text>
                        </View>
                    </View>
                || null
                }
            </View>
        </Banner>
    )
}

const styles = StyleSheet.create({
    bannerShowButton: {
        position: 'absolute',
        zIndex: 1,
        top: '10%',
        right: 10
    },
    banner: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.midGray,
      alignContent: 'center'
    },
    process: {
        fontSize: 16,
        fontFamily: 'NotoSansKR-Regular',
        includeFontPadding: false,
        color: Colors.gray,
    },
    title: {
        fontSize: 18,
        fontFamily: 'NotoSansKR-Medium',
        includeFontPadding: false,
        marginBottom: 10,
    },
    locationWrap: {
        width: 220,
    },
    location: {
        fontSize: 15,
        fontFamily: 'NotoSansKR-Regular',
        includeFontPadding: false,
        marginLeft: 4,
    }
})