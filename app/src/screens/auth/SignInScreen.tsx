import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, type } from '../../theme';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../context/AuthContext';

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'signUp' && !fullName.trim()) {
      setError('Enter your name.');
      return;
    }
    setLoading(true);
    const result =
      mode === 'signIn'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, fullName.trim());
    setLoading(false);
    if (result.error) setError(result.error);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView
        contentContainerStyle={[styles.body, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandBlock}>
          <Text style={type.h2}>Ablena Support</Text>
          <Text style={styles.tagline}>Connecting people. Enabling independence.</Text>
        </View>

        <Text style={[type.h4, styles.formTitle]}>
          {mode === 'signIn' ? 'Sign in' : 'Create your account'}
        </Text>

        <View style={styles.form}>
          {mode === 'signUp' && (
            <TextField
              label="Full name"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Amara N."
            />
          )}
          <TextField
            label="Email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={mode === 'signIn' ? 'Sign in' : 'Create account'}
            variant="primary"
            block
            loading={loading}
            onPress={submit}
          />
        </View>

        <Button
          title={mode === 'signIn' ? "New worker? Create an account" : 'Already have an account? Sign in'}
          variant="ghost"
          onPress={() => {
            setError(null);
            setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'));
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: space[6], alignItems: 'center', gap: space[6] },
  brandBlock: { alignItems: 'center' },
  tagline: { fontSize: 13, opacity: 0.6, marginTop: 4, color: colors.text },
  formTitle: { alignSelf: 'flex-start' },
  form: { width: '100%', gap: space[3] },
  error: { color: '#b3261e', fontSize: 12 },
});
