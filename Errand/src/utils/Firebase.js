import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const currentUser = auth().currentUser;
export const usersRef = firestore().collection('Users');
export const postsRef = firestore().collection('Posts');
export const chatsRef = firestore().collection('Chats');
export const heartsRef = firestore().collection('Hearts');