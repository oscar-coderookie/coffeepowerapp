// screens/AdminScreen.js
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import { auth, db } from '../../config/firebase'
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import ButtonGeneral from "../../components/ButtonGeneral";
import CustomHeader from "../../components/CustomHeader";
import LoadingScreen from "../../components/LoadingScreen";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminScreen({ navigation }) {
    const { colors } = useTheme();
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        setIsAdmin(false);
                        setLoading(false);
                        return;
                    }
                    try {
                        const userRef = doc(db, "users", user.uid);
                        const snap = await getDoc(userRef);
                        if (snap.exists() && snap.data().isAdmin) {
                            setIsAdmin(true);
                            setUserName(snap.data().name)
                        } else {
                            setIsAdmin(false);
                        }
                    } catch (e) {
                        console.error("Error verificando admin:", e);
                    } finally {
                        setLoading(false);
                    }
                });
                if (!user) {
                    setLoading(false);
                    return;
                }
                const userRef = doc(db, "users", user.uid);
                const snap = await getDoc(userRef);
                if (snap.exists() && snap.data().isAdmin) {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Error cargando usuario:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (!isAdmin) {
        return (
            <View style={styles.center}>
                <Text style={[styles.noAccess, { color: colors.text, fontFamily: "Jost" }]}>
                    No tienes acceso a esta sección.
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader title="Panel Administrativo"  />

            <Text style={[styles.title, { color: colors.text, fontFamily: "Jost" }]}>
               Hola Admin: {userName}
            </Text>
            <Text
                style={[
                    styles.subtitle,
                    { color: colors.text, fontFamily: "Jost" },
                ]}
            >
                En este apartado puedes gestionar todo lo relacionado con la base de datos de cafés y de clientes registrados en nuestra app.
            </Text>

            <View style={styles.section}>
           
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 20,
        marginHorizontal:10,
        textAlign:'center'
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
        lineHeight: 22,
        marginHorizontal:10,
        textAlign:'justify'
    },
    noAccess: { fontSize: 18, textAlign: "center", paddingHorizontal: 30 },
    section: {
        marginTop: 25,

    },
});
