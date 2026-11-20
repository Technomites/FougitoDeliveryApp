import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Color from '../../Constants/Color';
import Heading from './Heading';
import Paragraph from './Paragraph';
import SubHeading from './SubHeading';
import AuthButton from './AuthButton';
import {fontSize} from '../resposnevaraiable';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';

const RevievedModal = props => {
  const Images = [
    {
      id: Math.random(),
      image:
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80',
    },
    {
      id: Math.random(),
      image:
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80',
    },
    {
      id: Math.random(),
      image:
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80',
    },
    {
      id: Math.random(),
      image:
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80',
    },
  ];

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.visible}
        statusBarTranslucent>
        <View style={styles.centeredView}>
          <View style={styles.main}>
            <View style={styles.subHeadingMainView}>
              <SubHeading style={styles.subHeading} text={HardCode.QuoteOne} />
              <Paragraph text={HardCode.EightHourAgo} />
            </View>

            <View style={styles.subHeadingMainView2}>
              <View style={styles.subHeadingSubView2}>
                <SubHeading
                  style={{
                    ...styles.subHeading,
                    fontSize: fontSize.thirteen,
                  }}
                  text={HardCode.PartName}
                />
                <Paragraph
                  style={styles.paragraph}
                  text={HardCode.GlassMirror}
                />
              </View>

              <View style={styles.subHeadingMainView3}>
                <SubHeading
                  style={{
                    ...styles.subHeading,
                    fontSize: fontSize.thirteen,
                  }}
                  text={HardCode.Condition}
                />
                <Paragraph style={styles.paragraph} text={HardCode.New} />
              </View>
            </View>
            <View
              style={{
                ...styles.subHeadingMainView3,
                height: 50,
              }}>
              <SubHeading
                style={{
                  ...styles.subHeading,
                  fontSize: fontSize.thirteen,
                }}
                text={HardCode.Warrenty}
              />
              <Paragraph style={styles.paragraph} text={HardCode.TwoYears} />
            </View>

            <View style={styles.FlatListView}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={Images}
                renderItem={itemData => {
                  return (
                    <Image
                      style={styles.image}
                      source={{uri: itemData.item.image}}
                    />
                  );
                }}
              />
            </View>

            <View style={styles.headingView}>
              <Heading
                style={styles.subHeading2}
                text={HardCode.SparePartCondition}
              />
            </View>

            <View style={styles.subHeadingMainView4}>
              <View style={styles.subHeadingSubView4}>
                <SubHeading
                  style={{
                    ...styles.subHeading,

                    color: Color.headingWhiteColor,
                  }}
                  text={HardCode.Original}
                />
                <Paragraph
                  style={{color: Color.paraWhiteColor}}
                  text={HardCode.AED150}
                />
              </View>
              <View style={styles.subHeadingMainView5}>
                <SubHeading
                  style={{
                    ...styles.subHeading,
                  }}
                  text={HardCode.Tejari}
                />
                <Paragraph
                  style={{color: Color.paraBlackColor}}
                  text={HardCode.AED100}
                />
              </View>
            </View>

            <View style={styles.subHeadingWidth}>
              <View style={styles.subHeadingView}>
                <View style={styles.subHeadingWidth2}>
                  <SubHeading
                    style={{
                      ...styles.subHeading,
                    }}
                    text={HardCode.Quotation}
                  />
                </View>
                <View style={styles.subHeadingWidth2}>
                  <SubHeading
                    style={styles.subHeading2}
                    text={HardCode.AED150}
                  />
                </View>
              </View>
            </View>

            <View style={styles.subHeadingWidth}>
              <View style={styles.subHeadingView}>
                <View style={styles.subHeadingWidth2}>
                  <SubHeading
                    style={{
                      ...styles.subHeading,
                    }}
                    text={HardCode.DeliveryCharges}
                  />
                </View>
                <View style={styles.subHeadingWidth2}>
                  <SubHeading
                    style={styles.subHeading2}
                    text={HardCode.AED15}
                  />
                </View>
              </View>
            </View>

            <View style={styles.subHeadingWidth}>
              <View style={styles.subHeadingView}>
                <View style={styles.subHeadingWidth2}>
                  <SubHeading
                    style={{
                      ...styles.subHeading,
                      color: Color.headingColor,
                    }}
                    text={HardCode.TOTAL}
                  />
                </View>
                <View style={styles.subHeadingWidth2}>
                  <SubHeading
                    style={{
                      ...styles.subHeading2,
                      color: Color.headingColor,
                    }}
                    text={HardCode.AED165}
                  />
                </View>
              </View>
            </View>

            <View style={{}}>
              <Paragraph
                style={{
                  ...styles.paragraph,
                  fontFamily: FontFamily.Medium,
                  color: Color.paraotptextColor,
                  marginBottom: 12,
                }}
                text={
                  HardCode.TheInviteWillBeSentToTheCustomerViaSMSWhenYouAcceptQuotes
                }
              />
            </View>

            <View style={styles.authBtnView}>
              <AuthButton
                onPress={props.onAccept}
                title={HardCode.ACCEPTQUOTE}
              />
              <TouchableOpacity onPress={props.onClose} style={{marginTop: 10}}>
                <SubHeading
                  style={{color: Color.headingBlackColor}}
                  text={HardCode.CLOSE}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#000000d4',
    padding: 20,
    height: '100%',
  },
  modalView: {
    backgroundColor: 'red',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
  },
  button: {
    borderRadius: 0,
    padding: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  main: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 20,
    paddingBottom: -10,
  },
  subHeadingMainView: {
    height: '10%',
    width: '100%',
    backgroundColor: Color.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  subHeadingMainView2: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },
  subHeadingSubView2: {
    height: 40,
    width: '50%',

    justifyContent: 'center',
  },
  subHeadingMainView3: {
    height: 40,
    width: '50%',

    justifyContent: 'center',
  },
  FlatListView: {
    borderBottomColor: Color.lightGray,
    borderBottomWidth: 0.5,
    height: '13%',
    paddingVertical: 5,
    paddingBottom: 20,
  },
  headingView: {marginVertical: 5, marginTop: 15},
  subHeadingMainView4: {
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  subHeadingSubView4: {
    height: '100%',
    width: '48%',
    backgroundColor: 'black',
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeadingMainView5: {
    height: '100%',
    width: '48%',
    backgroundColor: Color.lightGray,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeadingView: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  subHeadingWidth: {width: '100%'},
  subHeadingWidth2: {width: '50%'},
  authBtnView: {
    marginTop: '2%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: fontSize.twelve,
    color: Color.paraGrayColor,
    fontFamily: FontFamily.Medium,
  },
  subHeading: {
    fontFamily: FontFamily.Medium,
    fontSize: fontSize.fourteen,
    color: Color.normaltextColor,
  },
  subHeading2: {
    textAlign: 'right',
    fontSize: fontSize.thirteen,
    color: Color.headingGrayColor,
  },
  image: {
    height: 50,
    width: 100,
    resizeMode: 'contain',
    borderRadius: 0,
    marginHorizontal: 5,
  },
});

export default RevievedModal;
