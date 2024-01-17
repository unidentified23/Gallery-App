import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';

export default function Gallery() {
    const navigation = useNavigation()

    const [pictures, setPictures] = useState([])
    const db = SQLite.openDatabase('photos.db');
    const getImages = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM photos',
                [],
                (_, result) => {
                    const images = result.rows._array;
                    setPictures(images)
                    console.log('Saved images:', images);
                },
                (_, error) => {
                    alert('Error retrieving images:',error);
                    console.log('Error retrieving images:', error);
                }
            );
        }, (err) => {
            console.log({ err });
        }, (result) => {
            console.log({ result });
        });
    };


    useEffect(() => {
        getImages()
    }, [])

    function deleteFun(imageId) {
        console.log(imageId);
        db.transaction((img) => {
            img.executeSql('DELETE FROM photos WHERE id = ?', [imageId], (img, results) => {
                if (results.rowsAffected > 0) {
                    alert('Image deleted');
                    getImages();

                } else {
                    console.log('image not found');
                }
            })
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                >
                    <MaterialCommunityIcons name='keyboard-backspace' size={30} color={"lime"} />

                </TouchableOpacity>
                <Text style={styles.heading}>Images</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name='dots-vertical' size={30} color={"lime"} />
                </TouchableOpacity>
            </View>
            {
                pictures.length > 0 &&
                <ScrollView style={styles.gallery}>
                    {pictures.map((img, index) => (
                        <View style={styles.scrollCon} key={index}>
                            <ImageBackground source={{ uri: img.uri }} style={{ width: 395, height: 400, marginBottom: 30 }} >
                                <TouchableOpacity onPress={() => deleteFun(img.id)}>
                                    <MaterialCommunityIcons name='delete' size={40} color={"red"} style={styles.delete} />
                                </TouchableOpacity>
                                <Text style={styles.city}>{img.city}</Text>
                            </ImageBackground>

                        </View>

                    ))}
                </ScrollView>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        width: "100%",

    },

    scrollCon: {
        justifyContent: "center",
        alignItems: "center",
        
    },

    topContainer: {
        marginTop: 100,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },

    heading: {
        fontSize: 25,
        color: "#fff"
    },

    delete: {
        padding: 5,
        marginLeft: "auto"
    },

    city:{
        marginTop: "auto",
        color: "#fff",
        fontSize: 20,
        left:"6%",
        bottom:"3%",
        
    }
})