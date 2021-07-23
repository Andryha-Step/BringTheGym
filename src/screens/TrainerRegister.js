// components/dashboard.js

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import firebase from '../../database/fireBase';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import TermsModal from '../components/TermsModal';
import LoginFunctions from '../utils/LoginFunction';

const {width, height} = Dimensions.get('window');

const CustomerRegister = props => {
  const [isLogged, setIsLogged] = useState('');

  const [errorMessage, setErrorMesasge] = useState('');
  const [fullName, setFullName] = useState('');

  const [address, setAddress] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [userPhoto, setuserPhoto] = useState(null);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [specialities, setSpecialities] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isTermsSelected, setIsTermsSelected] = useState(false);

  function onAuthStateChanged(user) {
    if (user) {
      props.navigation.navigate('Dashboard');
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const validateEmail = email => {
    console.log(email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      console.log('Email is Not Correct');
      setEmailError(true);
      setEmail(email);
      return false;
    } else {
      setEmailError(false);
      setEmail(email);
      console.log('Email is Correct');
    }
  };
  const registerUser = () => {
    if (telegram === '' && facebook === '' && whatsApp === '') {
      Alert.alert(
        'Enter details to signup or Login!',
        'Telegram, WhatsApp or Facebook is require',
        [
          {
            text: 'Login',
            onPress: () => props.navigation.navigate('Login'),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else if (email === '' || password === '' || fullName === '') {
      Alert.alert(
        'Enter details to signup or Login!',
        'Email,Password,Full Name is require',
        [
          {
            text: 'Login',
            onPress: () => props.navigation.navigate('Login'),
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
      );
    } else {
      try {
        let credential = auth.EmailAuthProvider.credential(email, password);
        return LoginFunctions.registerOrLinkTrainer(
          auth.EmailAuthProvider.PROVIDER_ID,
          credential,
          email,
          fullName,
          address,
          date,
          bio,
          qualification,
          specialities,
          userPhoto,
          telegram,
          whatsApp,
          facebook,
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  const selectPhoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      setuserPhoto({
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime,
        sourceURL: image.sourceURL,
      });
      console.log(userPhoto, 'photo');
    });
  };
  const onSubmit = () => {
    registerUser();
  };
  const onChangeDate = selectedDate => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={{width: width - 40}}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Register as Trainer</Text>

        <View style={styles.wrapper}>
          <View style={styles.inputItem}>
            <TouchableOpacity
              style={styles.userImage}
              onPress={() => selectPhoto()}>
              <Image
                style={{width: 100, height: 100, resizeMode: 'contain'}}
                source={
                  userPhoto ? userPhoto : require('../assets/profile_photo.png')
                }
              />
              <Text style={styles.plusIcon}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              autoCompleteType={'email'}
              onChangeText={value => validateEmail(value)}
              value={email}
              placeholder={'Email'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>Email is not valid</Text>
          )}
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0,0,0, 1)"
              value={password}
              onChangeText={val => setPassword(val)}
              maxLength={15}
              secureTextEntry={true}
              placeholder={'Password(min 6 characters)'}
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              placeholderTextColor="rgba(0,0,0, 1)"
              onChangeText={value => setFullName(value)}
              value={fullName}
              placeholder={'Full Name'}
            />
          </View>
          <View style={styles.inputItem}>
            <TouchableOpacity
              style={{
                backgroundColor: '#BBD5DA',
                fontSize: 17,
                borderRadius: 15,
                width: width - 40,
              }}
              onPress={() =>
                props.navigation.navigate('AddressScreen', {
                  setAddress: setAddress,
                })
              }>
              <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                {address ? address : 'Address'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputItem}>
            <TouchableOpacity
              style={{
                backgroundColor: '#BBD5DA',
                fontSize: 17,
                borderRadius: 15,
                width: width - 40,
              }}
              onPress={() => setDateModalVisible(true)}>
              <Text style={{borderRadius: 15, fontSize: 17, padding: 13}}>
                {date ? moment(date).format('MM DD YYYY') : 'Birthday'}
              </Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={dateModalVisible}>
              <View style={styles.modalStyle}>
                <DatePicker
                  textColor="#000"
                  mode="date"
                  date={date}
                  onDateChange={onChangeDate}
                />
                <TouchableOpacity
                  style={styles.submit}
                  onPress={() => {
                    setDateModalVisible(false);
                  }}>
                  <Text style={styles.textStyle}>Submit</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>

          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setBio(value)}
              value={bio}
              placeholder={'Bio'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setQualification(value)}
              value={qualification}
              placeholder={'Qualification'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setSpecialities(value)}
              value={specialities}
              placeholder={'Specialities'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setTelegram(value)}
              value={telegram}
              placeholder={'Telegram'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setWhatsApp(value)}
              value={whatsApp}
              placeholder={'WhatsApp'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
          <View style={styles.inputItem}>
            <TextInput
              style={styles.input}
              maxLength={150}
              onChangeText={value => setFacebook(value)}
              value={facebook}
              placeholder={'Facebook'}
              placeholderTextColor="rgba(0,0,0, 1)"
            />
          </View>
        </View>

        <TermsModal
          visible={isTermsModalVisible}
          onClose={() => setIsTermsModalVisible(false)}
        />

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <CheckBox
            value={isTermsSelected}
            onValueChange={setIsTermsSelected}
            boxType="square"
            style={{marginRight: Platform.OS === 'ios' ? 10 : 0}}
          />
          <TouchableOpacity
            style={{height: '100%', marginTop: 10}}
            onPress={() => setIsTermsModalVisible(true)}>
            <Text style={{fontSize: 18, textDecorationLine: 'underline'}}>
              I agree to terms and conditions
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.submit}
            onPress={() => props.navigation.goBack()}>
            <Text style={styles.textStyle}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submit,
              {backgroundColor: isTermsSelected ? '#21191A' : 'gray'},
            ]}
            onPress={() => (isTermsSelected ? onSubmit() : {})}>
            <Text style={styles.textStyle}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomerRegister;
const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },
  userImage: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    borderRadius: 100,
    marginBottom: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 25,
    color: '#fff',
  },
  container: {
    flex: 1,
    display: 'flex',
    paddingTop: Platform.OS === 'ios' ? 100 : 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: 'rgb(155,188,195)',
  },
  title: {
    width: '100%',
    fontSize: 27,
    paddingBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  modalStyle: {
    backgroundColor: '#fff',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
  },
  inputItem: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioForm: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'column',
    marginTop: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  radioWrapper: {
    width: '100%',
  },
  inputTitle: {
    width: '30%',
    fontSize: 17,
  },
  input: {
    padding: 13,
    width: '100%',
    backgroundColor: '#BBD5DA',
    fontSize: 17,
    borderRadius: 15,
  },

  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  submit: {
    marginTop: 20,
    width: width / 2 - 40,
    display: 'flex',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21191A',
    borderRadius: 25,
    zIndex: 100,
  },
  textStyle: {
    textTransform: 'uppercase',
    fontWeight: '500',
    color: '#98B2B6',
    fontSize: 17,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
