import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const ShowBottomSheet = (props) => {
  console.log(2)

  const {importFromCamera} = props
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    handlePresentModalPress()
  }, [])

  // renders
  return (
    <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enableDismissOnClose={true}
        >
          <View style={styles.contentContainer}>
            <Button onPress={() => {importFromCamera()}} title={'사진 촬영'}/>
            <Button onPress={() => {}} title={'앨범 선택'}/>
          </View>
        </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default ShowBottomSheet;