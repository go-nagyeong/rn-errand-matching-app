import { Dimensions } from 'react-native';

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

export const calculateGrade = (gradeNum) => {
    if (gradeNum >= 4.1) {
        return 'A+';
    } else if (gradeNum >= 3.6) {
        return 'A0';
    } else if (gradeNum >= 3.1) {
        return 'B+';
    } else if (gradeNum >= 2.6) {
        return 'B0';
    } else if (gradeNum >= 2.1) {
        return 'C+';
    } else if (gradeNum >= 1.6) {
        return 'C0';
    } else if (gradeNum >= 1.1) {
        return 'D+';
    } else if (gradeNum >= 0.6) {
        return 'D0';
    } else {
        return 'F';
    }
}