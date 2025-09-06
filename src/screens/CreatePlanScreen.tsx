import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { createPlan } from '../ApiConfig/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { savePlan } from '../storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePlan'>;

export default function CreatePlanScreen({ navigation }: Props) {
  const [goal, setGoal] = useState('');
  const [horizon, setHorizon] = useState<'today' | 'week'>('today');
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!goal.trim()) {
      Alert.alert('Validation', 'Please enter a goal.');
      return;
    }
    setLoading(true);
    try {
      const plan = await createPlan(goal.trim(), horizon);
      plan.tasks = plan.tasks.map(t => ({ ...t, completed: !!t.completed }));
      await savePlan({ ...plan, createdAt: new Date().toISOString() });
      navigation.navigate('Plan');
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Error',
        err?.response?.data?.error ?? err.message ?? 'Failed to create plan'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Plan</Text>
      <Text style={styles.label}>Short goal</Text>
      <TextInput
        value={goal}
        onChangeText={setGoal}
        placeholder="e.g., Launch an ecommerce store"
        style={styles.input}
        accessibilityLabel="Goal input"
      />

      <Text style={[styles.label, { marginTop: hp('3%') }]}>Time horizon</Text>
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segment, horizon === 'today' && styles.segmentActive]}
          onPress={() => setHorizon('today')}
          accessibilityRole="button"
          accessibilityState={{ selected: horizon === 'today' }}
        >
          <Text style={horizon === 'today' ? styles.segmentTextActive : styles.segmentText}>
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, horizon === 'week' && styles.segmentActive]}
          onPress={() => setHorizon('week')}
          accessibilityRole="button"
          accessibilityState={{ selected: horizon === 'week' }}
        >
          <Text style={horizon === 'week' ? styles.segmentTextActive : styles.segmentText}>
            This Week
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.generateBtn}
        onPress={onGenerate}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.generateBtnText}>Generate Plan</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.hint}>Your most recent plan will be saved locally.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fdfdfd',
  },
  title: {
    fontSize: wp('6.5%'),
    fontWeight: '700',
    marginBottom: hp('3%'),
    color: '#0077ff',
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: hp('1%'),
    fontSize: wp('4%'),
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('3%'),
    padding: wp('3.5%'),
    fontSize: wp('4%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: wp('5%'),
    backgroundColor: '#f0f0f0',
    marginTop: hp('1%'),
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  segmentActive: {
    backgroundColor: '#0077ff',
  },
  segmentText: {
    color: '#555',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp('4%'),
  },
  generateBtn: {
    marginTop: hp('4%'),
    backgroundColor: '#0077ff',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    shadowColor: '#0077ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  hint: {
    marginTop: hp('3%'),
    color: '#888',
    fontSize: wp('3.2%'),
    textAlign: 'center',
  },
});
