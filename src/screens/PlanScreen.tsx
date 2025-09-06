import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { loadPlan, savePlan } from '../storage';
import { Task, Plan, Priority } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = NativeStackScreenProps<RootStackParamList, 'Plan'>;

const PRIORITIES: (Priority | 'all')[] = ['all', 'high', 'medium', 'low'];

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#ff4d4d',
  medium: '#ffa500',
  low: '#4caf50',
};

export default function PlanScreen({ navigation }: Props) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [filter, setFilter] = useState<'all' | Priority>('all');

  useEffect(() => {
    const load = async () => {
      const p = await loadPlan();
      setPlan(p);
    };
    load();
  }, []);

 const toggleComplete = useCallback(
  async (id: string) => {
    if (!plan) return;
    const newPlan = {
      ...plan,
      tasks: plan.tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)),
    };
    setPlan(newPlan);
    try {
      await savePlan(newPlan); // ← persist the updated completion state
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save task state');
    }
  },
  [plan]
);


  const filtered = plan
    ? plan.tasks.filter(t => (filter === 'all' ? true : t.priority === filter))
    : [];

  if (!plan) {
    return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No plan found. Create one on the home screen.</Text>
        </View>
    );
  }

  return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.header}>Plan List</Text>
        
        <View style={styles.filterRow}>
          {PRIORITIES.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.filterBtn, filter === p && styles.filterBtnActive]}
              onPress={() => setFilter(p === 'all' ? 'all' : (p as Priority))}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === p }}
            >
              <Text style={filter === p ? styles.filterTextActive : styles.filterText}>
                {p === 'all' ? 'All' : p[0].toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: hp('1.5%') }} />}
          contentContainerStyle={{ padding: wp('4%') }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleComplete(item.id)}
              style={[styles.card, item.completed && styles.cardCompleted]}
              accessibilityRole="button"
              accessibilityState={{ selected: item.completed }}
            >
              <View style={styles.row}>
                <Text style={styles.emoji}>{item.emoji ?? '📝'}</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, item.completed && styles.titleCompleted]}>{item.title}</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: PRIORITY_COLORS[item.priority] },
                      ]}
                    >
                      <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={styles.meta}>{item.dueDate}</Text>
                  {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: wp('6.5%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
    color: '#0077ff',
    textAlign: 'center',
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: wp('4%') },
  emptyText: { color: '#666', fontSize: wp('4%') },
  filterRow: {
    flexDirection: 'row',
    padding: wp('3%'),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filterBtn: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('5%'),
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: hp('1%'),
  },
  filterBtnActive: { backgroundColor: '#0077ff', borderColor: '#0077ff' },
  filterText: { color: '#555', fontSize: wp('3.5%'), fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: '600', fontSize: wp('3.5%') },
  card: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardCompleted: { opacity: 0.7, backgroundColor: '#e6ffe6' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  emoji: { fontSize: wp('7%'), marginRight: wp('3%') },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp('0.5%') },
  title: { fontWeight: '600', fontSize: wp('4.5%'), color: '#333' },
  titleCompleted: { textDecorationLine: 'line-through', color: '#999' },
  meta: { color: '#666', fontSize: wp('3.2%') },
  notes: { color: '#555', marginTop: hp('0.5%'), fontSize: wp('3.5%') },
  priorityBadge: {
    paddingVertical: hp('0.3%'),
    paddingHorizontal: wp('2.5%'),
    borderRadius: wp('2%'),
  },
  priorityText: { color: '#fff', fontSize: wp('2.8%'), fontWeight: '600' },
});
