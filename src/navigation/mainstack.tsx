import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatePlanScreen from '../screens/CreatePlanScreen';
import PlanScreen from '../screens/PlanScreen';
import { RootStackParamList } from '../../App';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="CreatePlan">
      <Stack.Screen
        name="CreatePlan"
        component={CreatePlanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Plan"
        component={PlanScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
