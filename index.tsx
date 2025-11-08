import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";

interface MenuItem {
    _id: string;
    name: string;
    category: string;
    price: number;
}

export default function App() {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [randomItem, setRandomItem] = useState<MenuItem | null>(null);

    // ?? Replace with your system's local IP (not localhost!)
    const API_URL = "http://192.168.0.119:3000";

    const getMenu = async (): Promise<void> => {
        try {
            const res = await axios.get<MenuItem[]>(`${API_URL}/menu`);
            setMenu(res.data);
            setRandomItem(null);
        } catch (err) {
            console.error("Error fetching menu:", err);
        }
    };

    const getRandom = async (): Promise<void> => {
        try {
            const res = await axios.get<MenuItem>(`${API_URL}/menu/random`);
            setRandomItem(res.data);
            setMenu([]);
        } catch (err) {
            console.error("Error fetching random item:", err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>☕ Coffee Shop Menu ☕</Text>

            <View style={styles.buttonContainer}>
                <Button title="Full Menu" onPress={getMenu} color="#F4A261" />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Surprise Me!" onPress={getRandom} color="#2A9D8F" />
            </View>

            {menu.length > 0 && (
                <FlatList
                    data={menu}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>
                            {item.name} - {item.category} - Rs. {item.price}
                        </Text>
                    )}
                />
            )}

            {randomItem && (
                <Text style={styles.item}>
                    🎁 {randomItem.name} - {randomItem.category} - Rs. {randomItem.price}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#FFF8E7", // warm creamy background
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#4B3832", // deep coffee brown
    },
    item: {
        fontSize: 18,
        marginVertical: 5,
        color: "#3C6E71", // teal for text
    },
    buttonContainer: {
        marginVertical: 8,
    },
});
