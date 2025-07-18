import React from "react";
import { Platform, View } from "react-native";

export const Spacer = () => {
    return(
        <View style={{paddingTop:20}} />
    )
};

export const BigSpacer = () => {
    return(
        <View style={{paddingTop:Platform.OS == "ios" ? 80 : 70}} />
    )
}