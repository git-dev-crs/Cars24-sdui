import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

export interface InputFieldProps {
  placeholder?: string;
  value?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  onChangeText?: (text: string) => void;
}

/** Text input primitive. Kept uncontrolled-by-default (local state)
 * with an optional controlled `value` so it works both as a standalone
 * SDUI leaf node and inside a form that needs to read the value on
 * submit — the plate-number field only needs local state for this
 * assignment, but the escape hatch costs nothing. */
export default function InputField({
  placeholder,
  value,
  keyboardType = 'default',
  autoCapitalize = 'characters',
  onChangeText,
}: InputFieldProps): React.JSX.Element {
  const [internal, setInternal] = useState('');
  const isControlled = value !== undefined;

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={isControlled ? value : internal}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onChangeText={text => {
          if (!isControlled) setInternal(text);
          onChangeText?.(text);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: '#3B2FF2',
    borderRadius: 10,
    marginBottom: 4,
  },
  input: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111' },
});
