import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

import { Images } from '@/constants/images';

const customers = [
  {
    id: '1',
    name: 'Ralph Edwards',
    startDate: 'Tiffin Start 16 August',
    subscription: 'Monthly',
    image: Images.Dummy,
  },
  {
    id: '2',
    name: 'Annette Black',
    startDate: 'Tiffin Start 16 August',
    subscription: 'Weekly',
    image: Images.Dummy2,
  },
  {
    id: '3',
    name: 'Kathryn Murphy',
    startDate: 'Tiffin Start 16 August',
    subscription: 'Weekly',
    image: Images.Dummy3,
  },
  {
    id: '4',
    name: 'Darlene Robertson',
    startDate: 'Tiffin Start 16 August',
    subscription: 'Monthly',
    image: Images.Dummy4,
  },
  {
    id: '5',
    name: 'Devon Lane',
    startDate: 'Tiffin Start 16 August',
    subscription: 'Weekly',
    image: Images.Dummy5,
  },
  {
    id: '6',
    name: 'Theresa Webb',
    startDate: 'Tiffin Start 16 August',
    subscription: 'Monthly',
    image: Images.Dummy6,
  },
];

export default function MyCustomersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Customers</Text>
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.customerRow}>
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.startDate}>{item.startDate}</Text>
            </View>
            <Text style={styles.subscription}>{item.subscription}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    
  },
  profileImage: { width: 44, height: 44, borderRadius: 22, marginRight: 14 },
  info: { flex: 1 },
  name: { fontWeight: '500', fontSize: 14,color:'#666060' },
  startDate: { color: '#A5A5A5', fontSize: 12, marginTop: 4,fontWeight:'400' },
  subscription: { fontSize: 14, fontWeight: '500', color: '#666060' },
});
