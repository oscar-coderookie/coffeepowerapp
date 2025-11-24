import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, query, orderBy, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import ButtonGeneral from "./ButtonGeneral";
import Toast from "react-native-toast-message";

export default function ReviewsSection({ coffeeId }) {
    const { user, userData } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [text, setText] = useState("");
    const [stars, setStars] = useState(0);
    const [userReviewId, setUserReviewId] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const { colors } = useTheme();

    useEffect(() => {
        const ref = collection(db, "coffees", coffeeId, "reviews");
        const q = query(ref, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setReviews(list);
            const avg =
                list.length > 0
                    ? list.reduce((sum, r) => sum + r.stars, 0) / list.length
                    : 0;

            setAverageRating(avg);

            if (user) {
                const own = snap.docs.find((d) => d.data().userId === user.uid);

                if (own) {
                    // Solo cargar los valores iniciales si AÚN no los habías cargado
                    if (!userReviewId) {
                        setUserReviewId(own.id);
                        setText(own.data().text);
                        setStars(own.data().stars);
                    }
                }
            }
        });

        return unsubscribe;
    }, [coffeeId, user]);


    const handleSubmit = async () => {
        if (!user) return;

        if (stars === 0) {
            alert("Selecciona tu puntuación.");
            return;
        }

        const username = userData?.name;
        const avatar = userData?.avatar;

        const data = {
            userId: user.uid,
            userName: username,
            userAvatar: avatar,
            stars,
            text,
            createdAt: new Date(),
        };

        try {
            if (userReviewId) {
                // actualizar
                await setDoc(doc(db, "coffees", coffeeId, "reviews", userReviewId), data);
                Toast.show({
                    type: "success",
                    text1: "Reseña modificada",
                    text2: "Reseña correctamente modificada",
                });
            } else {
                // crear
                await addDoc(collection(db, "coffees", coffeeId, "reviews"), data);
            }
            Toast.show({
                type: "success",
                text1: "Reseña creada",
                text2: "Reseña correctamente creada",
            });
        } catch (e) {
            console.log("Error saving review", e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Reseñas:</Text>
            {/* Lista de reseñas */}
            {reviews.map((r) => (
                <View key={r.id} style={[styles.reviewCard]}>

                    {/* Texto + estrella pequeña */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={[styles.text, { color: colors.text, flex: 1 }]}>
                            "{r.text}"
                        </Text>

                        {/* Estrella + número */}
                        <View style={{ alignItems: "center", marginLeft: 8 }}>
                            <Ionicons name="star" size={20} color="gold" />
                            <Text style={{ color: colors.text, fontSize: 12 }}>{r.stars}</Text>
                        </View>
                    </View>

                    <View style={styles.headerRow}>
                        {/* Avatar */}
                        <View style={styles.avatarWrapper}>
                            {r.userAvatar ? (
                                <Image source={{ uri: r.userAvatar }} style={styles.avatar} />
                            ) : (
                                <View style={styles.placeholderAvatar}>
                                    <Ionicons name="person" size={22} color="#888" />
                                </View>
                            )}
                        </View>

                        {/* Nombre + fecha */}
                        <View style={styles.headerInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{r.userName}</Text>
                            <Text style={{ color: colors.text, fontSize: 10 }}>
                                {new Date(r.createdAt.toDate()).toLocaleString("es-ES", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </Text>
                        </View>

                        {/* Botón EDITAR SOLO SI ES DEL USUARIO */}
                        {r.userId === user?.uid && (
                            <TouchableOpacity
                                style={{ marginLeft: "auto" }}
                                onPress={() => setIsEditing(true)}
                            >
                                <Ionicons name="create-outline" size={20} color={colors.text} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ))}

            {/* SI YA TIENE RESEÑA Y NO ESTÁ EDITANDO → OCULTA EL FORMULARIO */}
            {userReviewId && !isEditing ? null : (
                <>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Escribe una reseña sobre el producto:
                    </Text>

                    {/* Input */}
                    <TextInput
                        placeholder="Escribe tu reseña..."
                        placeholderTextColor={colors.text}
                        value={text}
                        onChangeText={setText}
                        style={[styles.input, { borderColor: colors.text, color: colors.text }]}
                        multiline
                    />

                    {/* Estrellas */}
                    <View style={styles.starsRow}>
                        <Text style={{ color: colors.text }}>Selecciona una puntuación:</Text>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <TouchableOpacity key={n} onPress={() => setStars(n)}>
                                <Ionicons
                                    name={n <= stars ? "star" : "star-outline"}
                                    size={28}
                                    color="gold"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ButtonGeneral
                        text={userReviewId ? "Actualizar reseña" : "Enviar reseña"}
                        onTouch={() => {
                            handleSubmit();
                            setIsEditing(false);
                        }}
                        textColor="#000"
                        borderColors={[colors.goldSecondary, colors.gold, colors.goldSecondary]}
                        bckColor={[colors.gold, colors.goldSecondary]}
                    />
                </>
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginTop: 20,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "Jost_600SemiBold",
        marginBottom: 16,
        textAlign: "center",
    },
    starsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        alignItems: 'center'
    },
    starsRowSmall: {
        flexDirection: "row",
        marginBottom: 6,
    },
    input: {
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        marginBottom: 12,
        textAlignVertical: "top",
        fontFamily: "Jost_400Regular",
        borderWidth: 1
    },
    button: {
        backgroundColor: "#c58c3c",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#000",
        fontFamily: "Jost_600SemiBold",
        fontSize: 16,
    },
    reviewCard: {
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,

    },
    userName: {
        color: "#fff",
        fontFamily: "Jost_600SemiBold",

    },
    text: {
        color: "#ddd",
        fontFamily: "Jost_400Regular",
        marginBottom: 10
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    avatarWrapper: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    placeholderAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
    },
    headerInfo: {
        flex: 1,
    },
});
