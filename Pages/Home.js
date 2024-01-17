import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera } from 'expo-camera'
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



const db = SQLite.openDatabase('photos.db');

export default function Home() {
    const [hasPermission, setHasPermision] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [pictures, setPictures] = useState([]);
    const navigation = useNavigation();

    

    useEffect(() => {

        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermision(status === 'granted')


        })();
    }, [])

    
    const takePicture = async () => {
        if (camera) {
          try {
            const photo = await camera.takePictureAsync();
            const { status } = await Location.requestForegroundPermissionsAsync();
            let location = await Location.getCurrentPositionAsync({});
            let { latitude, longitude } = location.coords;
            let geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            let city = geocode[0].city;
            if (status === "granted") {
              db.transaction((tx) => {
                tx.executeSql(
                  'CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, city TEXT, latitude REAL, longitude REAL)'
                );
              }, (err) => {
                console.log({ err });
              }, (result) => {
                console.log({ result });
              });
      
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO photos (uri, city, latitude, longitude) VALUES (?, ?, ?, ?)',
                  [photo.uri, city, latitude, longitude]
                );
              }, (err) => {
                console.log({ errInInsert: err });
              }, (res) => {
                console.log({ resInInsert: res });
              });
              setImage(photo.uri);
            }
          } catch (error) {
            console.error('Error occured while taking a picture:', error);
          }
        }
      };
      



    useEffect(() => {
        return () => {
            db.closeAsync()
        }
    }, [])

    console.log(image);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }


    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity>

                    <MaterialCommunityIcons name='flash-off' size={30} color={"black"} />

                </TouchableOpacity>
                
                <TouchableOpacity>
                    <MaterialCommunityIcons name='format-align-justify' size={50} color={"black"} />
                </TouchableOpacity>
            </View>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={(ref) => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'1:1'}
                />
            </View>
            {
                pictures.length > 0 &&
                <View style={{ zIndex: 1000, backgroundColor: 'red', width: Dimensions.get('window').width, height: 500 }}>
                    {pictures.map((pic) => (
                        <>
                            <Text >{pic.location} </Text>
                            <Image source={{ uri: pic.uri }} style={{ width: 200, height: 200 }} />
                        </>

                    ))}
                </View>
            }

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Gallery')}
                >
                    <MaterialCommunityIcons name='image' size={35} color={"lime"} />

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => takePicture()}
                >
                    <MaterialCommunityIcons name='camera' size={35} color={"lime"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back
                        );
                    }}

                >
                    <MaterialCommunityIcons name='camera-retake-outline' size={35} color={"lime"} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },

    cameraContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'row',
    },
    fixedRatio: {
        // width: 300,
        flex: 1,
        aspectRatio: 1
    },
    button: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
        marginBottom: 20,
    },

    icon: {
        width: 50,
        height: 50
    },
    bottomContainer: {
        marginTop: "auto",
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    }
    ,
    topContainer: {
        marginTop: 100,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor:"lime",
    }
})