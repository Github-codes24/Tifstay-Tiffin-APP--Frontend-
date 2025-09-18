import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import { Images } from "@/constants/Images";
import { router } from "expo-router";

interface HostelCardProps {
    hostel: any;
    onPress?: () => void;
    onBookPress?: () => void;
}

const amenityIcons: { [key: string]: string } = {
    WiFi: "wifi",
    Mess: "restaurant",
    Security: "shield-checkmark",
    Laundry: "shirt",
    AC: "snow",
    Gym: "fitness",
    Parking: "car",
};

export default function HostelCard({
    hostel,
    onPress,
    onBookPress,
}: HostelCardProps) {
    return (
        <TouchableOpacity
            style={styles.hostelCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                {/* Left side - Image */}
                <Image source={Images.hostel1} style={styles.hostelImage} />

                {/* Right side - Content */}
                <View style={styles.hostelInfo}>
                    {/* Title and Rating Row */}
                    <View style={styles.headerRow}>
                        <Text style={styles.hostelName} numberOfLines={1}>
                            {hostel.name}
                        </Text>
                    </View>

                    <Text style={styles.sublocation}>Seminary Hills</Text>

                    <View style={styles.amenitiesRow}>
                        {hostel?.amenities?.slice(0, 4)?.map((amenity: any) => (
                            <View key={amenity} style={styles.amenityItem}>
                                <Ionicons
                                    name={(amenityIcons[amenity] as any) || "checkmark-circle"}
                                    size={16}
                                    color="#6B7280"
                                />
                                <Text style={styles.amenityText}>{amenity}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Fixed Row Section */}
                    <View style={[styles.rowBetween]}>
                        <View style={styles.infoBlock}>
                            <Text style={styles.price}>
                                {hostel.price}
                                <Text style={styles.deposit}>month</Text>
                            </Text>
                            <Text style={styles.deposit}>Rent</Text>
                        </View>

                        <View style={styles.infoBlock}>
                            <Text style={styles.booking}>6/30</Text>
                            <Text style={styles.deposit}>Available</Text>
                        </View>

                        <View style={styles.infoBlock}>
                            <View style={styles.ratingRow}>
                                <Image source={Images.star} style={styles.starIcon} />
                                <Text style={styles.rating}>
                                    4.7 <Text style={styles.review}>(8)</Text>
                                </Text>
                            </View>
                            <Text style={styles.deposit}>Rating</Text>
                        </View>

                        <View style={styles.infoBlock}>
                            <Text style={styles.type}>Boys</Text>
                            <Text style={styles.deposit}>Type</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.button}>
                            <Image source={Images.view} style={styles.btnIcon} />
                            <Text style={styles.btnText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Image source={Images.edit} style={styles.btnIcon} />
                            <Text style={styles.btnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Image source={Images.pause} style={styles.btnIcon} />
                            <Text style={styles.btnText}>Pause</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Image source={Images.delete} style={styles.btnIcon} />
                            <Text style={styles.btnText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                     <TouchableOpacity style={[styles.button , {width:'100%' , marginTop:16} ]} onPress={()=>{router.push('/viewroom')}}>
                            <Image source={Images.view} style={styles.btnIcon} />
                            <Text style={styles.btnText}> View Rooms</Text>
                        </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    hostelCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        marginTop:16
    },
    cardContent: {
        flexDirection: "row",
        padding: 12,
    },
    hostelImage: {
        width: 82,
        height: 82,
        borderRadius: 12,
        marginRight: 12,
    },
    hostelInfo: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    hostelName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        flex: 1,
        marginRight: 8,
    },
    rating: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1A1A1A",
    },
    sublocation: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 6,
    },
    amenitiesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 2,
        marginBottom: 8,
    },
    amenityItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        borderColor: "#9C9BA6",
        borderWidth: 1,
        borderRadius: 12,
        padding: 3,
        margin: 2,
    },
    amenityText: {
        fontSize: 8,
fontFamily:fonts.interRegular,
        color: Colors.title,
    },
    deposit: {
        fontSize: 10,
        color: Colors.grey,
        fontFamily: fonts.interRegular,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        gap: 6
        // marginTop: 16,
    },
    infoBlock: {
        // flex: 1,
        // alignItems: "center", // center each block
    },
    price: {
        fontFamily: fonts.interSemibold,
        fontSize: 12,
        color: Colors.primary,
    },
    booking: {
        fontSize: 12,
        color: Colors.title,
        textAlign: "left",
        fontFamily: fonts.interSemibold,
    },
    review: {
        fontSize: 12,
        color: Colors.grey,
        fontFamily: fonts.interRegular,
    },
    type: {
        fontSize: 12,
        color: Colors.title,
        textAlign: "center",
        fontFamily: fonts.interSemibold,
    },
    starIcon: {
        height: 14,
        width: 14,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 16,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.5,
        borderColor: Colors.lightGrey,
        borderRadius: 6,
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal:6,
        // width: 56,
        gap: 2
    },
    btnIcon: {
        height: 16,
        width: 16,
    },
    btnText: {
        // marginLeft: 6,
        fontSize: 10,
        color: Colors.grey,
        fontFamily: fonts.interRegular,
    },
    label: {
        fontSize: 10,
        fontFamily: fonts.interRegular,
    },
});