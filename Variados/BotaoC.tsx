import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';
import styles from './Styles';

interface CustomButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  texto: string;
}

export default function CustomButton({ onPress, texto }: CustomButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{texto}</Text>
    </TouchableOpacity>
  );
}
