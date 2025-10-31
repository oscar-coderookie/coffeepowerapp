import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";

<MotiView
    from={{ translateX: -150 }}
    animate={{ translateX: 150 }}
    transition={{
        loop: true,
        duration: 3000,
        easing: "ease-in-out",
    }}
    style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: 80,
        backgroundColor: "rgba(255,255,255,0.2)",
        transform: [{ rotate: "20deg" }],
    }}
/>

const ButtonGeneral = ({
    onTouch,
    bckColor,
    text,
    textColor,
    marginHorizontal,
    disable,
}) => {
    const isGradient = Array.isArray(bckColor);

    return (
        <TouchableOpacity
            disabled={disable}
            onPress={onTouch}
            activeOpacity={0.8}
            style={{
                marginVertical: 6,
                marginHorizontal: marginHorizontal,
                borderRadius: 10,
                overflow: "hidden",
                opacity: disable ? 0.6 : 1,
            }}
        >
            <MotiView
                from={{ translateX: -150 }}
                animate={{ translateX: 150 }}
                transition={{
                    loop: true,
                    duration: 3000,
                    easing: "ease-in-out",
                }}
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: 80,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    transform: [{ rotate: "20deg" }],
                }}
            />
            {isGradient ? (
                <LinearGradient
                    colors={bckColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        padding: 16,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "Jost_700Bold",
                            textTransform: "uppercase",
                            textAlign: "center",
                            color: textColor,
                        }}
                    >
                        {text}
                    </Text>
                </LinearGradient>
            ) : (
                <Text
                    style={{
                        fontFamily: "Jost_700Bold",
                        textTransform: "uppercase",
                        textAlign: "center",
                        color: textColor,
                        backgroundColor: bckColor,
                        padding: 16,
                        borderRadius: 10,
                    }}
                >
                    {text}
                </Text>
            )}
        </TouchableOpacity>
    );
};

export default ButtonGeneral;
