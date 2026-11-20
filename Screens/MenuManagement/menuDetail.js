import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableOpacity,
  TextInput,
  Text,
  FlatList,
  Switch,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import BackHeader from '../../Components/UI-Support/BackHeader';
import SubHeading from '../../Components/UI-Support/SubHeading';
import Heading from '../../Components/UI-Support/Heading';
import Color from '../../Constants/Color';
import {C} from '../../Constants/tokens';
import AuthButton from '../../Components/UI-Support/AuthButton';
import CheckBox from 'react-native-check-box';

// import {BaseUrl} from '../../Components/BaseUrl';
import Paragraph from '../../Components/UI-Support/Paragraph';
import Fnta from 'react-native-vector-icons/Fontisto';
import MenuListTile from '../../Components/UI-Support/MenuListTile';
import {useDispatch, useSelector} from 'react-redux';
import * as DataAction from '../../Store/Data/DataAction';
import {fontSize} from '../../Components/resposnevaraiable';
import FocusAwareStatusBar from '../../Components/UI-Support/customStatusBar';
import {FontFamily} from '../../Constants/fonts';
import {HardCode} from '../../Constants/texting';
import { AUTHTOKENSTATEDISPATH } from '../../Store/Auth/AuthActionConst';
export default function MenuDetail(props) {
  const categories = props.route.params.categories;
  const MenuId = props.route.params.menuId;
  const userToken = userSuccessData?.Result?.AuthData?.TokenInfo?.Token;

  // useEffect(() => {
  //   if (MenuData) {
  //     setSelectedCat(MenuData[0]?.Categories[0]);
  //   }
  // }, [MenuData]);

  const [updateLoader, setUpdateLoader] = useState(false);
  const [updatePriceModal, setUpdatePriceModal] = useState(false);
  const [sizeActive, setSizeActive] = useState(true);
  const [flavourActive, setFlavourActive] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(MenuData[0]?.Categories[0]);
  const [menuToggle, setMeniToggle] = useState(selectedCat?.IsActive);
  const [selectedItem, setSelectedItem] = useState();
  const [itemValues, setItemValues] = useState();
  const [popUpItemSelect, setPopUpItemSelect] = useState();
  const [ItemDetails, setItemDetails] = useState();
  const [isRequires, setIsRequired] = useState(false);
  const [priceEditable, setProceEditable] = useState(false);

  const BaseUrl = useSelector(state => state.auth.BaseUrl);
  const MenuData = useSelector(state =>
    state.data.GetMenuMangement.filter(i => i.MenuId == MenuId),
  );
  const userSuccessData = useSelector(state => state.auth.userSuccessData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (popUpItemSelect) {
      setIsRequired(popUpItemSelect?.IsRequired);
      setProceEditable(popUpItemSelect?.IsPriceMain);
    }
  }, [popUpItemSelect]);

  const GetItemValuesOption = id => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${userToken}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Partner/Menu/${id}/Options`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.Result) {
          setItemDetails(result?.Result);
          setItemValues(result?.Result?.MenuItemOptions);
          setPopUpItemSelect(result?.Result?.MenuItemOptions[0]);
        }
      })
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  const MenuItemToggleStatus = (recordId, status) => {
    const Statustype = status ? 4 : 3;
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${userToken}`);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}Partner/Menu/MenuItem/${recordId}/ToggleStatus/${Statustype}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  const UpdateItemHandler = () => {
    setUpdateLoader(true);
    // toast.current.hideAll();
    const itemDetailsUpdates = {
      ...ItemDetails,
      IsRequired: isRequires,
      IsPriceMain: priceEditable,
      MenuItemOptions: itemValues,
    };

    let MenuUpdatedArray = itemDetailsUpdates.MenuItemOptions;

    for (let i = 0; i < MenuUpdatedArray.length; i++) {
      if (MenuUpdatedArray[i].Id === popUpItemSelect.Id) {
        MenuUpdatedArray[i] = popUpItemSelect;
      }
    }

    const itemDetailsUpdatesFinal = {
      ...ItemDetails,

      MenuItemOptions: MenuUpdatedArray,
    };
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${userToken}`);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify(itemDetailsUpdatesFinal);

    console.log(popUpItemSelect, 'POP ITEM SELECT');
    console.log(raw, 'RAW');

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BaseUrl}Partner/Menu`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result) {
          dispatch(
            DataAction.ToastMessageSenderScreenAction(
              HardCode.MenuItemUpdatedSuccessfully,
            ),
          );

          // toast.current.show('Menu Item updated successfully');

          setItemDetails();
          setItemValues();
          setPopUpItemSelect();

          setUpdatePriceModal(!updatePriceModal);
          setUpdateLoader(false);
        }
      })
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  const ShowOnMenuToggle = (recordId, status) => {
    const Statustype = selectedCat?.IsActive ? 4 : 3;
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${userToken}`);
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${BaseUrl}Partner/Menu/${selectedCat.MenuId}/Category/${selectedCat.Id}/ToggleStatus/${Statustype}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error =>{
        dispatch({
          type: AUTHTOKENSTATEDISPATH,
          payload: true,
        });
        console.log('error', error)});
  };

  return (
    <SafeAreaView style={styles.mainView}>
      <FocusAwareStatusBar
        barStyle={'dark-content'}
        backgroundColor="transparent"
      />
      <BackHeader
        onPress={() => props.navigation.goBack()}
        title={HardCode.MenuManagement}
        filter={false}
      />

      <View style={styles.TextInputView}>
        <TextInput
          style={styles.textinput}
          value={search}
          onChangeText={text => setSearch(text)}
          placeholder={HardCode.Search}
        />
        <Text style={styles.fantaText}>
          <Fnta name="search" size={18} color="rgba(42,28,28,0.5)" />
        </Text>
      </View>

      <View style={styles.flatlistView}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={MenuData[0]?.Categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={itemData => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setMeniToggle(itemData.item.IsActive);
                  setSelectedCat(itemData.item);
                }}
                style={{
                  ...styles.flatlistTouchable,
                  backgroundColor:
                    selectedCat?.Name === itemData.item.Name
                      ? Color.btnBgColorOtherPlace
                      : 'white',
                }}>
                <SubHeading
                  style={{
                    ...styles.touchableSubheading,

                    color:
                      selectedCat?.Name === itemData.item.Name
                        ? Color.headingWhiteColor
                        : Color.headingBlackColor,
                  }}
                  text={itemData.item.Name}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.switchMainView}>
        <View>
          <SubHeading
            style={styles.switchsubheading}
            text={HardCode.ShowOnMenu}
          />
        </View>

        <View>
          <Switch
            onChange={() => {
              setMeniToggle(!menuToggle);
              ShowOnMenuToggle();
              try {
                const toggele = dispatch(
                  DataAction.ShowOnMenuToggleAction(selectedCat),
                );
                if (toggele) {
                  // toast.current.hideAll();
                  dispatch(
                    DataAction.ToastMessageSenderScreenAction(
                      `Category ${
                        !menuToggle ? HardCode.Active : HardCode.InActive
                      } successfully`,
                    ),
                  );
                }
              } catch (err) {
                console.log(err);
              }
            }}
            value={menuToggle}
          />
        </View>
      </View>
      <View style={styles.flatlistView2}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={selectedCat?.Items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={itemData => {
            if (
              itemData?.item.Name.toLowerCase()?.includes(
                search.trim().toLowerCase(),
              )
            ) {
              return (
                <MenuListTile
                  onChange={() => {
                    MenuItemToggleStatus(
                      itemData.item.Id,
                      itemData.item.IsActive,
                    );
                    dispatch(DataAction.OnItemToggleAction(itemData.item));
                  }}
                  onPress={() => {
                    GetItemValuesOption(itemData.item.Id);
                    setUpdatePriceModal(true);
                    setSelectedItem(itemData.item);
                  }}
                  published
                  title={itemData.item.Name}
                  imageUrl={itemData.item.Image}
                  publish={itemData.item.IsActive}
                  value={itemData.item.IsActive}
                  price={`${HardCode.AED} ${itemData.item.Price}`}
                />
              );
            }
          }}
        />
      </View>

      {/* ORDER DETAIL MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={updatePriceModal}
        statusBarTranslucent>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{paddingHorizontal: 16}}>
              <Heading style={styles.heading} text={HardCode.UpdatePrice} />
            </View>
            <View style={styles.menulistView}>
              <MenuListTile
                onChange={() => {
                  MenuItemToggleStatus(selectedItem.Id, selectedItem.IsActive);
                  dispatch(DataAction.OnItemToggleAction(selectedItem));
                }}
                style={{width: '97%'}}
                published
                title={selectedItem?.Name}
                imageUrl="https://upload.wikimedia.org/wikipedia/commons/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg"
                publish={selectedItem?.IsActive}
                value={selectedItem?.IsActive}
                price={`${HardCode.AED} ${selectedItem?.Price}`}
              />
            </View>

            <View style={styles.flatlistView3}>
              <FlatList
                horizontal
                data={itemValues}
                keyExtractor={(item, index) => index.toString()}
                renderItem={itemData => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setPopUpItemSelect(itemData?.item);
                        setSizeActive(!sizeActive);
                        setFlavourActive(!flavourActive);
                      }}
                      style={{
                        ...styles.flatlistTouchable2,
                        backgroundColor:
                          popUpItemSelect?.Id === itemData.item.Id
                            ? C.accentTint
                            : '#cecece4a',

                        borderBottomColor:
                          popUpItemSelect?.Id === itemData.item.Id
                            ? Color.btnBgColor
                            : '#CECECE',

                        width: Dimensions.get('window').width / 2 - 40,
                      }}>
                      <Heading
                        style={{
                          color:
                            popUpItemSelect?.Id === itemData.item.Id
                              ? Color.btnBgColor
                              : Color.black,
                          ...styles.heading2,
                        }}
                        text={itemData?.item?.Title}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            <View style={styles.checkBoxView}>
              <View style={styles.checkBoxSubView}>
                <SubHeading
                  text={HardCode.Required}
                  style={styles.subHeading}
                />
              </View>
              <View style={{justifyContent: 'center'}}>
                <CheckBox
                  onClick={() => {
                    const new_obj = {
                      ...popUpItemSelect,
                      IsRequired: !popUpItemSelect?.IsRequired,
                    };

                    setPopUpItemSelect(new_obj);
                  }}
                  isChecked={popUpItemSelect?.IsRequired}
                  checkBoxColor={'#7D7C7C'}
                  checkedCheckBoxColor={Color.btnBgColor}
                />
              </View>
            </View>
            <View style={styles.checkBoxView}>
              <View style={styles.checkBoxSubView}>
                <SubHeading
                  text={HardCode.EditablePrice}
                  style={styles.subHeading}
                />
              </View>
              <View style={{justifyContent: 'center'}}>
                <CheckBox
                  onClick={() => {
                    const new_obj = {
                      ...popUpItemSelect,
                      IsPriceMain: !popUpItemSelect?.IsPriceMain,
                    };

                    setPopUpItemSelect(new_obj);
                  }}
                  isChecked={popUpItemSelect?.IsPriceMain}
                  checkBoxColor={'#7D7C7C'}
                  checkedCheckBoxColor={Color.btnBgColor}
                />
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {popUpItemSelect?.MenuItemOptionValues?.map(i => {
                return (
                  <View style={styles.scrollviewView}>
                    <View style={styles.checkBoxSubView}>
                      <SubHeading
                        text={i?.Value}
                        style={{
                          ...styles.subHeading,
                          fontSize: fontSize.thirteen,
                          opacity: 0.5,
                        }}
                      />
                    </View>
                    <View style={styles.TextInputView2}>
                      <View style={{width: '20%'}}>
                        <SubHeading
                          style={{color: Color.headingBlackColor}}
                          text={HardCode.AED}
                        />
                      </View>
                      <View style={{width: '70%'}}>
                        <TextInput
                          maxLength={7}
                          value={i.Price.toString()}
                          keyboardType="number-pad"
                          placeholder={HardCode.Price}
                          placeholderTextColor={Color.lightGreyTextColor}
                          style={{color: Color.btnBgColorOtherPlace}}
                          onChangeText={text => {
                            const finalArray =
                              popUpItemSelect.MenuItemOptionValues.map(item => {
                                if (item.Id === i.Id) {
                                  item.Price = text;
                                }
                                return item;
                              });
                            const newList = {
                              ...popUpItemSelect,
                              MenuItemOptionValues: finalArray,
                            };

                            setPopUpItemSelect(newList);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.emptyView}></View>
            <View style={{marginHorizontal: 16}}>
              {updateLoader ? (
                <ActivityIndicator color={Color.loaderColor} size="large" />
              ) : (
                <AuthButton
                  onPress={UpdateItemHandler}
                  title={HardCode.UPDATE}
                />
              )}

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setItemValues();
                  setPopUpItemSelect();
                  setUpdatePriceModal(!updatePriceModal);
                }}
                style={styles.headingTouchable}>
                <Heading
                  style={{color: Color.black, textAlign: 'center'}}
                  text={HardCode.CLOSE}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: '#DFE0E2',
    position: 'relative',
    height: 44,
    borderRadius: 0,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000d4',
    paddingHorizontal: 30,
  },
  modalView: {
    backgroundColor: '#FFF',
    borderRadius: 0,
    paddingVertical: 16,
    width: '100%',
  },
  inputStyle: {
    backgroundColor: '#8E7C7C14',
    fontFamily: FontFamily.Medium,
    color: '#29262A',
    fontSize: fontSize.fifteen,
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  mainView: {flex: 1, backgroundColor: '#EFF1F3'},
  TextInputView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: 'rgba(42,28,28,0.1)',
    borderRadius: 0,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  textinput: {
    width: '90%',
    height: 50,
    paddingLeft: 15,
  },
  fantaText: {alignSelf: 'center', paddingLeft: 5, width: '10%'},
  flatlistView: {width: '92.5%', marginHorizontal: 15, marginTop: 10},
  flatlistTouchable: {
    marginRight: 10,
    borderRadius: 0,

    padding: 15,
  },
  touchableSubheading: {
    fontSize: fontSize.twelve,

    textTransform: 'uppercase',
  },
  switchMainView: {
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  switchsubheading: {
    fontSize: fontSize.fifteen,
    color: Color.headingBlackColor,
  },
  flatlistView2: {
    width: '92.5%',
    marginHorizontal: 15,
    marginTop: 10,
    height: '95%',
  },
  heading: {color: Color.black, fontSize: fontSize.eightteen},
  menulistView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistView3: {flexDirection: 'row', marginTop: 20},
  flatlistTouchable2: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomColor: '#CECECE',
    borderBottomWidth: 4,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  heading2: {fontSize: fontSize.fourteen, textAlign: 'center'},
  checkBoxView: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomColor: '#D4D4D4',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  checkBoxSubView: {flex: 1, justifyContent: 'center'},
  subHeading: {
    fontFamily: FontFamily.Medium,
    color: Color.headingnormaltextColor,
    fontSize: fontSize.fifteen,
  },
  scrollView: {width: '100%', maxHeight: 200},
  scrollviewView: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  TextInputView2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#cecece4a',

    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyView: {
    borderBottomColor: '#D4D4D4',
    borderBottomWidth: 1,
    marginVertical: 26,
  },
  headingTouchable: {
    marginTop: 16,
    marginBottom: 6,
    height: 30,
    width: '100%',
  },
});
