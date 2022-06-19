import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
// 헤더 바
import AIcon from 'react-native-vector-icons/AntDesign';
import FIcon from 'react-native-vector-icons/Feather';
import Container from '../../components/Container';
import Colors from '../../constants/Colors';
import * as Common from '../../utils/Common';
import * as Firebase from '../../utils/Firebase';
import Loader from '../../components/Loader';


export default ShowEditPost = (props) => {
    const navigation = useNavigation()

    const { title, content, price, writerEmail, id, image, views, arrive, destination, date } = props.route.params;

    // 완료 버튼 누르기 전에는 DB 수정 로직 실행되지 않게 (첫 렌더링에서 감시 변수로 인해 실행됨)
    const [isBeforeEdit, setBeforeEdit] = useState(true)

    const [isLoading, setLoading] = useState(false);

    // ----------------------- 제목, 내용, 금액, 위치 ----------------------- 
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedPrice, setEditedPrice] = useState(price);
    const [editedContent, setEditedContent] = useState(content);
    const [editedDestination, setEditedDestination] = useState(destination)
    const [editedArrive, setEditedArrive] = useState(arrive);
    
    const [titleMessage, setTitleMessage] = useState(null);
    const [priceMessage, setPriceMessage] = useState(null);
    const [contentMessage, setContentMessage] = useState(null);
    const [destinationMessage, setDestinationMessage] = useState(null);
    const [arriveMessage, setArriveMessage] = useState(null);

    useEffect(() => {
        if (editedTitle.length < 2) {
            setTitleMessage('제목은 최소 2글자 이상 작성해주세요.')
        } else {
            setTitleMessage(null)
        }
    }, [editedTitle])
    
    useEffect(() => {
        if (typeof(editedPrice) == 'string') {
            const num_price = Number(editedPrice.replace(/[^0-9]/g, ''))  // 숫자 외 입력 제한
            setEditedPrice(num_price)
        } else {
            if (editedPrice >= 100000) {
                setEditedPrice(99999)
            }
            if (editedPrice == '') {
                setPriceMessage('금액을 입력해 주세요.')
            } else {
                setPriceMessage(null)
            }
        }
    }, [editedPrice])

    useEffect(() => {
        if (editedContent.length < 2) {
            setContentMessage('내용은 최소 2글자 이상 작성해주세요.')
        } else {
            setContentMessage(null)
        }
    }, [editedContent])


    // ----------------------------- 이미지 -----------------------------
    const [localImages, setLocalImage] = useState(image)
    const [editedImageUrl, setEditedImageUrl] = useState([])
    
    const selectImage = () => {
        const options = {
            mediaType: "photo",
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            selectionLimit: 3,
        };
    
        launchImageLibrary(options, response => {
            if (response["didCancel"]) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                response['assets'].forEach((item, index) => {
                    url = Platform.OS === 'ios' ? item['uri'].replace('file://', '') : item['uri']
                    setLocalImage(localImages => [...localImages, url])
                })
            }
        });
    };

    const getImageUrl = () => {
        // 이미지 변경을 했으면 storage에서 기존 이미지 삭제
        if (localImages != image) {
            storage()
                .ref('Posts/' + id + "%" + writerEmail)
                .listAll()
                .then(dir => {
                    dir.items.forEach(fileRef => {
                        fileRef.delete()
                    })
                    console.log('기존 이미지 삭제')
                })
                .catch(err => {
                    setLoading(false)
                    console.log(err)
                });

            // 로컬에서 사진을 추가했으면 storage에 이미지 저장 후 url 가져오기
            if (localImages.length > 0) {
                localImages.forEach(img => {
                    let storageId = Math.random().toString(36).substring(7);
    
                    const task = storage().ref(`Posts/${id + "%" + writerEmail}/` + storageId).putFile(img)
                    task.then(() => {
                        storage()
                            .ref(`Posts/${id + "%" + writerEmail}/` + storageId)
                            .getDownloadURL()
                            .then((url) => {
                                setEditedImageUrl(editedImageUrl => [...editedImageUrl, url])
                                console.log('추가한 사진 저장 및 url 가져오기')
                            })
                            .catch((e) => {
                                setLoading(false)
                                console.log('게시물 사진 다운로드 실패 => ', e)
                            });
                    })
                })
            // 로컬에서 사진을 삭제하기만 했으면 image 필드 비우기
            } else {
                setEditedImageUrl([])
                console.log('image 필드 지우기')
            }

        // 이미지 변경을 안했어도 (DB 수정 로직 실행을 위해) 
        } else {
            setEditedImageUrl([])
            console.log('변수 재할당')
        }
    }

    // -----------------------------------------------------------------
    // 1) DB 수정 전 유효성 검사
    const confirmBeforeEdit = () => {
        // 경고 메시지가 하나도 없으면 유효성 검사 통과
        // DB에 반영하기 전 storage에 추가한 이미지 저장하거나 삭제하는 프로세스 진행
        if (!titleMessage && !priceMessage && !contentMessage) {
            setLoading(true)
            getImageUrl()
        }
    }

    // 2) DB 수정 로직 실행
    useEffect(() => {
        // 완료 버튼 누르기 전에는 DB 수정 로직 실행되지 않게
        if (!isBeforeEdit) {
            // localImages의 forEach가 다 돌아가면 실행되게
            if (localImages.length == editedImageUrl.length) {
                editPost()
            }
        }
        setBeforeEdit(false)
    }, [editedImageUrl])

    // 3) DB 수정 로직
    const editPost = () => {
        console.log('DB 수정 실행')

        Firebase.postsRef
            .doc(id + "%" + writerEmail)
            .update({
                title: editedTitle,
                price: editedPrice,
                content: editedContent,
                destination: editedDestination,
                arrive: editedArrive,
                image: editedImageUrl
            })
            .then(() => {
                setLoading(false)
                navigation.pop()
                navigation.pop()
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }



    // 게시물 삭제
    const deletePost = () => {
        Alert.alert(
            "심부름 삭제",
            "정말로 삭제하시겠습니까?",
            [{
                text: "확인",
                onPress: () => {
                    Firebase.heartsRef
                        .where('postId', '==', id + '%' + writerEmail)
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach(doc => {
                                doc.ref.delete()
                            })
                        })
                        .catch(err => console.log(err));
                    
                    storage()
                        .ref('Posts/' + id + '%' + writerEmail)
                        .listAll()
                        .then(dir => {
                            dir.items.forEach(fileRef => {
                                fileRef.delete()
                            })
                        })
                        .catch(err => console.log(err));

                    Firebase.postsRef
                        .doc(id + '%' + writerEmail)
                        .delete()
                        .then(() => props.navigation.navigate('Home'))
                        .catch(err => console.log(err));
                },
                style: "default",
            },
            {
                text: "취소",
                style: "default",
            }],
        );
    }


    const _goBack = () => props.navigation.goBack();
    // (V1과 다른 점 => 전체적인 UI)
    return (
        <>
            <Container>
                {/* 게시물 이미지 추가 및 삭제 */}
                <View style={styles.imageWrap}>
                    {localImages.length != 0
                        ?
                        <TouchableOpacity style={styles.imageButton} onPress={() => setLocalImage([])}>
                            <Image style={{width: '100%', height: 300}} source={{ uri: localImages[0] }} resizeMode="cover" />
                            <AIcon style={{position: 'absolute'}} name='minuscircle' size={50} color={Colors.white} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.imageButton} onPress={() => selectImage()}>
                            <AIcon style={{position: 'absolute'}} name='pluscircle' size={50} color={Colors.white} />
                        </TouchableOpacity>
                    }
                </View>

                <View style={styles.contents}>
                    {/* 게시물 수정 완료 버튼 */}
                    <TouchableOpacity style={styles.editCompleteButton} onPress={() => confirmBeforeEdit()}>
                        <Text style={styles.editCompleteButtonText}>완료</Text>
                    </TouchableOpacity>

                    {/* 타이틀 텍스트 */}
                    <View style={styles.title}>
                        <TextInput
                            style={[styles.input, styles.titleText]}
                            placeholder="(필수) 제목"
                            value={editedTitle}
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={true}
                            onChangeText={(text) => setEditedTitle(text)}
                            maxLength={30}
                        />
                        {titleMessage && <Text style={styles.message}>{titleMessage}</Text>}
                    </View>

                    {/* 가격 */}
                    <View style={styles.price}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput
                                style={[styles.input, styles.priceText]}
                                keyboardType='numeric'
                                value={editedPrice ? editedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null}
                                autoCapitalize='none'
                                autoCorrect={false}
                                blurOnSubmit={true}
                                onChangeText={text => setEditedPrice(text)}
                            />
                            <Text style={{fontSize: 17, color: Colors.black}}>원</Text>
                        </View>
                        {priceMessage && <Text style={styles.message}>{priceMessage}</Text>}
                    </View>

                    {/* 내용 텍스트 */}
                    <View style={styles.content}>
                        <TextInput
                            style={styles.contentText}
                            placeholder="(필수) 내용"
                            value={editedContent}
                            autoCapitalize='none'
                            autoCorrect={false}
                            onChangeText={(text) => setEditedContent(text)}
                            maxLength={1000}
                            multiline={true}
                        />
                        {contentMessage && <Text style={styles.message}>{contentMessage}</Text>}
                    </View>

                    {/* 목적지, 도착지 */}
                    <View style={styles.location}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="(선택) 목적지를 작성해 주세요."
                            value={editedArrive}
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={true}
                            onChangeText={(text) => setEditedArrive(text)}
                        />
                    </View>

                    <View style={styles.location}>
                        <TextInput
                            style={[styles.input]}
                            placeholder="(선택) 도착지를 작성해 주세요."
                            value={editedDestination}
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={true}
                            onChangeText={(text) => setEditedDestination(text)}
                        />
                    </View>
                    
                    {/* 게시물 삭제 버튼 */}
                    <TouchableOpacity style={[styles.deleteButton, { backgroundColor: Colors.red }]} onPress={() => deletePost()}>
                        <Text style={[styles.deleteButtonText, { color: Colors.white }]}>삭제</Text>
                    </TouchableOpacity>
                </View>
            </Container>

            <Loader isLoading={isLoading} />
        </>
    );
};

const styles = StyleSheet.create({
    contents: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    imageWrap: {
        width: '100%',
        height: 300,
        backgroundColor: Colors.midGray,
        marginBottom: 14,
    },
    imageButton: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7,
    },
    editCompleteButton: {
        alignSelf: 'flex-end',
        padding: 4,
        marginBottom: 14,
    },
    editCompleteButtonText: {
        fontWeight: '600',
        color: Colors.black,
        fontSize: 16,
    },
    input: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray2,
    },
    message: {
        fontSize: 14,
        color: Colors.red,
        marginLeft: 1,
        marginTop: 10,
    },
    title: {
        marginBottom: 12,
    },
    titleText: {
        fontWeight: '600',
        color: Colors.black,
        fontSize: 18,
    },
    price: {
        alignItems: 'flex-end',
        marginBottom: 38,
    },
    priceText: {
        width: '20%',
        fontSize: 17,
        color: Colors.black,
        textAlign: 'right',
        marginRight: 5,
    },
    content: {
        marginBottom: 38,
    },
    contentText: {
        color: Colors.darkGray2,
        fontSize: 15,

        paddingTop: 14,
        paddingBottom: 14,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors.lightGray2,
        borderRadius: 10,
    },
    location: {
        marginHorizontal: "8%",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: "#eee",
        marginBottom: 14,
    },
    locationText: {
        color: Colors.black,
        fontSize: 14,
    },
    deleteButton: {
        alignItems: 'center',
        padding: 10,
        marginHorizontal: '30%',
        borderRadius: 20,
        marginTop: 30,
        marginBottom: 10,
    },
    deleteButtonText: {
        fontWeight: '700',
        color: Colors.black,
        fontSize: 16,
    }
});