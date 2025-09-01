import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';

import { Images } from '@/constants/images';

const AccountScreen = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Image source={Images.Dummy} style={styles.largeImage} />
          <Text style={styles.title}>Maharashtrian Ghar Ka Khana</Text>
        </View>

        {/* Blue Profile Button */}
        <TouchableOpacity style={styles.primaryButton}>
          <View style={styles.buttonContent}>
            <Image source={Images.Profile} style={styles.smallIcon} />
            <Text style={styles.buttonText}>Profile</Text>
          </View>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>

        {/* Menu Items */}
        <MenuItem label="Address" image={Images.address} />
        <MenuItem label="My Customers" image={Images.customer} />
        <MenuItem label="Offers" image={Images.offers} />
        <MenuItem label="Privacy Policy" image={Images.PrivacyPolicyIcon} />
        <MenuItem label="Terms and Conditions" image={Images.termsandconditions} />
        <MenuItem label="Contact Us" image={Images.contactus} />

        {/* Language Dropdown (Static) */}
        <View style={styles.languageRow}>
          <Text style={styles.languageText}>Language</Text>
          <Text style={styles.languageDropdown}>English ▼</Text>
        </View>

        {/* Dark Mode Toggle */}
        <View style={styles.switchRow}>
          <Text style={styles.languageText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        {/* Logout */}
        <MenuItem label="Log Out" image={Images.address} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ label, image }: { label: string; image: any }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Image source={image} style={styles.smallIcon} />
    <Text style={styles.menuText}>{label}</Text>
    <Text style={styles.arrow}>{'>'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  largeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#0052cc',
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  smallIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageText: {
    fontSize: 16,
  },
  languageDropdown: {
    fontSize: 16,
    color: '#444',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default AccountScreen;
