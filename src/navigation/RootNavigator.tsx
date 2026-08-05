import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import SduiHomeScreen from '../screens/SduiHomeScreen';
import StaticHomeScreen from '../screens/StaticHomeScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Lightweight placeholder used for navigate-target routes that exist
 * only to prove SDUI "navigate" actions actually push a real screen
 * (CarDetails, BuyUsedCar, Loans, Insurance) — out of scope to build
 * out fully for this assignment. */
function PlaceholderScreen({ label }: { label: string }): React.JSX.Element {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{label}</Text>
    </View>
  );
}

export default function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SduiHome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SduiHome" component={SduiHomeScreen} />
        <Stack.Screen name="StaticHome" component={StaticHomeScreen} options={{ headerShown: true, title: 'Static (Benchmark)' }} />
        <Stack.Screen name="Login">{() => <PlaceholderScreen label="Login Screen" />}</Stack.Screen>
        <Stack.Screen name="CarValuation">{() => <PlaceholderScreen label="Car Valuation Screen" />}</Stack.Screen>
        <Stack.Screen name="ScrapEarn">{() => <PlaceholderScreen label="Scrap & Earn Screen" />}</Stack.Screen>
        <Stack.Screen name="SellYourCar">{() => <PlaceholderScreen label="Sell Your Car Screen" />}</Stack.Screen>
        <Stack.Screen name="CarDetails">{() => <PlaceholderScreen label="Car Details Screen" />}</Stack.Screen>
        <Stack.Screen name="BuyUsedCar">{() => <PlaceholderScreen label="Buy Used Car Screen" />}</Stack.Screen>
        <Stack.Screen name="Loans">{() => <PlaceholderScreen label="Loans Screen" />}</Stack.Screen>
        <Stack.Screen name="Insurance">{() => <PlaceholderScreen label="Insurance Screen" />}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
