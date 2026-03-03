import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ScrollView, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../store/LanguageProvider';
import {
  Entypo,
  FontAwesome5,
  Foundation,
  Ionicons,
  Octicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

const DRAWER_WIDTH = Dimensions.get('window').width * 0.65;

const CustomDrawer = ({ isVisible, onClose }) => {
  const styles = createStyles(isVisible);
  const navigation = useNavigation();
  const { language } = useLanguage();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, onClose]);

  const menuItems = [
    { 
      name: 'Home', 
      title: language === 'te' ? 'స్వాగతం' : 'Welcome',
      icon: (color) => <Ionicons name="home" color={color} size={18} />
    },
    { 
      name: 'AboutUs', 
      title: language === 'te' ? 'మా గురించి' : 'About Us',
      icon: (color) => <Ionicons name="person" color={color} size={18} />
    },
    { 
      name: 'Animals', 
      title: language === 'te' ? 'పశువులు' : 'Animals',
      icon: (color) => <MaterialCommunityIcons name="cow" size={21} color={color} />
    },
    { 
      name: 'RecentWorks', 
      title: language === 'te' ? 'ఇటీవలి రచనలు' : 'Recent Works',
      icon: (color) => <Entypo name="back-in-time" size={20} color={color} />
    },
    { 
      name: 'ResearchAreas', 
      title: language === 'te' ? 'పరిశోధనా ప్రాంతాలు' : 'Research Areas',
      icon: (color) => <MaterialCommunityIcons name="book-search" size={20} color={color} />
    },
    { 
      name: 'Byproducts', 
      title: language === 'te' ? 'ఆవుల ఉప ఉత్పత్తులు' : 'By products of Cow',
      icon: (color) => <MaterialCommunityIcons name="cow" size={21} color={color} />
    },
    { 
      name: 'Technologies', 
      title: language === 'te' ? 'సాంకేతికతలు' : 'Technologies',
      icon: (color) => <Octicons name="workflow" size={20} color={color} />
    },
    { 
      name: 'Teaching', 
      title: language === 'te' ? 'బోధన' : 'Teaching',
      icon: (color) => <FontAwesome5 name="chalkboard-teacher" size={18} color={color} />
    },
    { 
      name: 'Extention', 
      title: language === 'te' ? 'ఎక్సటెన్షన్' : 'Extention',
      icon: (color) => <MaterialCommunityIcons name="sale" size={22} color={color} />
    },
    { 
      name: 'IndianHeritage', 
      title: language === 'te' ? 'భారతీయ వారసత్వం' : 'Indian Heritage',
      icon: (color) => <Foundation name="sheriff-badge" size={20} color={color} />
    },
    { 
      name: 'FarmerHelpDesk', 
      title: language === 'te' ? 'రైతుల హెల్ప‌డెస్క్' : 'Farmer HelpDesk',
      icon: (color) => <FontAwesome5 name="hands-helping" size={18} color={color} />
    },
    { 
      name: 'Publication', 
      title: language === 'te' ? 'ప్రచురణలు' : 'Publication',
      icon: (color) => <Ionicons name="book-sharp" size={20} color={color} />
    },
    { 
      name: 'FeedBack', 
      title: language === 'te' ? 'ప్రతిస్పందన' : 'FeedBack',
      icon: (color) => <Entypo name="new-message" size={22} color={color} />
    },
    { 
      name: 'Contact', 
      title: language === 'te' ? 'సంప్రదించండి' : 'Contact Us',
      icon: (color) => <Entypo name="phone" size={22} color={color} />
    },
        { 
      name: 'Content', 
      title: language === 'te' ? 'కొత్త సమాచారం' : 'Learning Content',
      icon: (color) =>        <MaterialCommunityIcons
                name="book-open-page-variant"
                size={28}
                color="#ffffff"
              />
    },
    { 
      name: 'Profile', 
      title: language === 'te' ? 'ప్రొఫైల్' : 'Profile',
      icon: (color) => <Ionicons name="person-circle-sharp" size={24} color={color} />
    },
  ];

  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 15 }}
          style={{
            flex: 1,
            marginRight: -20,
            paddingRight: 20
          }}>
          {menuItems.map((item, index) => (
              <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.name)}
            >
              <View style={styles.menuItemContent}>
                {item.icon("white")}
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
          // Making sure the touch events are captured across the whole screen
          hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
        />
      )}
    </View>
  );
};

const createStyles = (isVisible) => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: isVisible ? 999 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#185828',
    padding: 15,
    paddingTop: 50,
    zIndex: 2,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    color: 'white',
    fontSize: 15,
    marginLeft: 25,
  },
  hamburger: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 101,
    padding: 10,
  },
  hamburgerLine: {
    width: 25,
    height: 2,
    backgroundColor: 'white',
    marginVertical: 2,
  },
});

export default CustomDrawer;