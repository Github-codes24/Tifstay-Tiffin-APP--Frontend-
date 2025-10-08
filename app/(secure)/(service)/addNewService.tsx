import CommonButton from "@/components/CommonButton";
import CommonDropdown from "@/components/CommonDropDown";
import CommonHeader from "@/components/CommonHeader";
import LabeledInput from "@/components/labeledInput";
import StepperInput from "@/components/SteperInput";
import { Colors } from "@/constants/Colors";
import { fonts } from "@/constants/typography";
import hostelApiService from "@/services/hostelApiService";
import useServiceStore from "@/store/serviceStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RoomData {
  id: string;
  roomNo: string;
  noOfBeds: number;
  roomDetails: string;
  roomPhotos: any[];
  _id?: string;
  isNewRoom?: boolean;
}

const MINIMUM_PHOTOS_PER_ROOM = 3;
const MAXIMUM_PHOTOS_PER_ROOM = 5;

const AddNewHostelService = () => {
  const params = useLocalSearchParams();
  const mode = params.mode as "add" | "edit";
  const hostelId = params.hostelId as string;
  const isUpdatingHostel = mode === "edit";
  const router = useRouter();
  const { setFormPage1Data, clearFormData } = useServiceStore();

  const [hostelName, setHostelName] = useState("");
  const [description, setDescription] = useState("");
  const [hostelType, setHostelType] = useState<string | null>("select");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [weeklyPrice, setWeeklyPrice] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [offers, setOffers] = useState("");
  const [amenities, setAmenities] = useState({
    wifi: false,
    meals: false,
    security: false,
    studyHall: false,
    commonTV: false,
    cctv: false,
    acRooms: false,
    laundry: false,
  });

  const [rooms, setRooms] = useState<RoomData[]>([
    {
      id: "1",
      roomNo: "",
      noOfBeds: 0,
      roomDetails: "",
      roomPhotos: [],
    },
  ]);
  const [activeRoomId, setActiveRoomId] = useState<string>("1");
  const [isLoadingData, setIsLoadingData] = useState(false);

  // ✅ Track photos to delete from server
  const [photosToDeleteFromRooms, setPhotosToDeleteFromRooms] = useState<{
    [roomId: string]: string[];
  }>({});

  useEffect(() => {
    const loadHostelData = async () => {
      if (!isUpdatingHostel || !hostelId) return;

      setIsLoadingData(true);
      try {
        console.log("📥 Loading hostel data for ID:", hostelId);
        const response = await hostelApiService.getHostelServiceById(hostelId);

        if (response.success && response.data?.data) {
          const hostelData = response.data.data;
          console.log("✅ Loaded hostel data:", hostelData);

          setHostelName(hostelData.hostelName || "");
          setDescription(hostelData.description || "");

          const hostelTypeMap: { [key: string]: string } = {
            "Boys Hostel": "boys",
            "Girls Hostel": "girls",
            "Co-ed Hostel": "coed",
          };
          setHostelType(hostelTypeMap[hostelData.hostelType] || "boys");

          setPricePerDay(hostelData.pricing?.perDay || 0);
          setMonthlyPrice(hostelData.pricing?.monthly || 0);
          setWeeklyPrice(hostelData.pricing?.weekly || 0);
          setSecurityDeposit(hostelData.securityDeposit || 0);
          setOffers(hostelData.offers || "");

          const facilitiesMap: { [key: string]: keyof typeof amenities } = {
            WiFi: "wifi",
            Mess: "meals",
            Security: "security",
            "Study Hall": "studyHall",
            "Common TV": "commonTV",
            CCTV: "cctv",
            "AC Rooms": "acRooms",
            Laundry: "laundry",
          };

          const newAmenities = {
            wifi: false,
            meals: false,
            security: false,
            studyHall: false,
            commonTV: false,
            cctv: false,
            acRooms: false,
            laundry: false,
          };

          hostelData.facilities?.forEach((facility: string) => {
            const key = facilitiesMap[facility];
            if (key) {
              newAmenities[key] = true;
            }
          });
          setAmenities(newAmenities);

          // ✅ Load rooms with photos field
          if (hostelData.rooms && hostelData.rooms.length > 0) {
            const transformedRooms: RoomData[] = hostelData.rooms.map(
              (room: any, index: number) => ({
                id: room._id || `room-${index}`,
                roomNo: room.roomNumber?.toString() || "",
                noOfBeds: room.totalBeds?.length || 0,
                roomDetails: room.roomDescription || "",
                roomPhotos:
                  room.photos?.map((url: string, photoIndex: number) => ({
                    uri: url,
                    type: "image/jpeg",
                    name: `room_${index}_photo_${photoIndex}.jpg`,
                    isExisting: true,
                  })) || [],
                _id: room._id,
                isNewRoom: false,
              })
            );

            setRooms(transformedRooms);
            setActiveRoomId(transformedRooms[0].id);
          }

          console.log("✅ Form populated successfully");
        } else {
          Alert.alert("Error", "Failed to load hostel data");
        }
      } catch (error) {
        console.error("❌ Error loading hostel data:", error);
        Alert.alert("Error", "Failed to load hostel data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadHostelData();
  }, [isUpdatingHostel, hostelId]);

  const pickRoomImage = useCallback(
    async (roomId: string) => {
      try {
        const room = rooms.find((r) => r.id === roomId);
        if (room && room.roomPhotos.length >= MAXIMUM_PHOTOS_PER_ROOM) {
          Alert.alert(
            "Maximum Photos Reached",
            `You can only upload up to ${MAXIMUM_PHOTOS_PER_ROOM} photos per room`
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const newPhoto = {
            uri: result.assets[0].uri,
            type: "image/jpeg",
            name: `room_photo_${Date.now()}.jpg`,
            isExisting: false,
          };

          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room.id === roomId
                ? { ...room, roomPhotos: [...room.roomPhotos, newPhoto] }
                : room
            )
          );
        }
      } catch (error) {
        console.error("Image picker error:", error);
        Alert.alert("Error", "Failed to pick image. Please try again.");
      }
    },
    [rooms]
  );

  // ✅ ENHANCED: Remove room photo with server deletion
  const removeRoomPhoto = useCallback(
    async (roomId: string, photoIndex: number) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      const photo = room.roomPhotos[photoIndex];

      // If it's an existing photo (from server) and we're in edit mode
      if (photo.isExisting && isUpdatingHostel && room._id) {
        Alert.alert(
          "Delete Photo",
          "Do you want to delete this photo from the server?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  // ✅ Call API to delete photo from server
                  const response = await hostelApiService.deleteRoomPhotos(
                    hostelId,
                    room._id!,
                    [photo.uri]
                  );

                  if (response.success) {
                    // Remove from local state
                    setRooms((prevRooms) =>
                      prevRooms.map((r) =>
                        r.id === roomId
                          ? {
                              ...r,
                              roomPhotos: r.roomPhotos.filter(
                                (_, i) => i !== photoIndex
                              ),
                            }
                          : r
                      )
                    );
                    Alert.alert("Success", "Photo deleted successfully");
                  } else {
                    Alert.alert(
                      "Error",
                      response.error || "Failed to delete photo"
                    );
                  }
                } catch (error) {
                  console.error("Error deleting photo:", error);
                  Alert.alert("Error", "Failed to delete photo");
                }
              },
            },
          ]
        );
      } else {
        // Just remove locally (new photo not yet uploaded)
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  roomPhotos: room.roomPhotos.filter(
                    (_, i) => i !== photoIndex
                  ),
                }
              : room
          )
        );
      }
    },
    [rooms, isUpdatingHostel, hostelId]
  );

  const addMoreRoom = useCallback(() => {
    const newRoomId = Date.now().toString();
    const newRoom: RoomData = {
      id: newRoomId,
      roomNo: "",
      noOfBeds: 0,
      roomDetails: "",
      roomPhotos: [],
      isNewRoom: true,
    };
    setRooms((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoomId);
  }, []);

  const deleteRoom = useCallback(
    (roomId: string) => {
      if (rooms.length === 1) {
        Alert.alert("Cannot Delete", "You must have at least one room");
        return;
      }

      Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newRooms = rooms.filter((room) => room.id !== roomId);
            setRooms(newRooms);
            if (activeRoomId === roomId) {
              setActiveRoomId(newRooms[0].id);
            }
          },
        },
      ]);
    },
    [rooms, activeRoomId]
  );

  const updateRoomField = useCallback(
    (roomId: string, field: keyof RoomData, value: any) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, [field]: value } : room
        )
      );
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    if (!hostelName.trim()) {
      Alert.alert("Validation Error", "Please enter hostel name");
      return false;
    }

    if (hostelName.trim().length < 3) {
      Alert.alert(
        "Validation Error",
        "Hostel name must be at least 3 characters"
      );
      return false;
    }

    if (!hostelType || hostelType === "select") {
      Alert.alert("Validation Error", "Please select hostel type");
      return false;
    }

    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter hostel description");
      return false;
    }

    if (description.trim().length < 20) {
      Alert.alert(
        "Validation Error",
        "Description must be at least 20 characters"
      );
      return false;
    }

    if (pricePerDay === 0 && weeklyPrice === 0 && monthlyPrice === 0) {
      Alert.alert(
        "Validation Error",
        "Please enter at least one pricing option (Daily, Weekly, or Monthly)"
      );
      return false;
    }

    if (securityDeposit === 0) {
      Alert.alert(
        "Validation Error",
        "Security deposit is required and must be greater than 0"
      );
      return false;
    }

    if (rooms.length === 0) {
      Alert.alert("Validation Error", "Please add at least one room");
      return false;
    }

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const roomLabel = room.roomNo || `Room ${i + 1}`;

      if (!room.roomNo.trim()) {
        Alert.alert(
          "Validation Error",
          `Please enter room number for ${roomLabel}`
        );
        return false;
      }

      if (room.noOfBeds === 0) {
        Alert.alert(
          "Validation Error",
          `Please enter number of beds for ${roomLabel}`
        );
        return false;
      }

      if (!room.roomDetails.trim()) {
        Alert.alert(
          "Validation Error",
          `Please enter room details for ${roomLabel}`
        );
        return false;
      }

      if (room.roomDetails.trim().length < 10) {
        Alert.alert(
          "Validation Error",
          `Room details for ${roomLabel} must be at least 10 characters`
        );
        return false;
      }

      // ✅ Only validate photos for new rooms in edit mode
      if (!isUpdatingHostel || room.isNewRoom) {
        if (room.roomPhotos.length < MINIMUM_PHOTOS_PER_ROOM) {
          Alert.alert(
            "Validation Error",
            `Please upload at least ${MINIMUM_PHOTOS_PER_ROOM} photos for ${roomLabel}. Currently ${room.roomPhotos.length} uploaded.`
          );
          return false;
        }
      }
    }

    return true;
  }, [
    hostelName,
    hostelType,
    description,
    pricePerDay,
    weeklyPrice,
    monthlyPrice,
    securityDeposit,
    rooms,
    isUpdatingHostel,
  ]);

  const handleNext = useCallback(() => {
    if (!validateForm()) return;

    const allRoomPhotos = rooms.flatMap((room) => room.roomPhotos);

    setFormPage1Data({
      hostelName: hostelName.trim(),
      description: description.trim(),
      hostelType: hostelType as string,
      pricePerDay,
      monthlyPrice,
      weeklyPrice,
      securityDeposit,
      offers: offers.trim(),
      amenities,
      roomPhotos: allRoomPhotos,
      rooms: rooms.map((room) => ({
        roomNo: room.roomNo.trim(),
        noOfBeds: room.noOfBeds,
        roomDetails: room.roomDetails.trim(),
        roomPhotos: room.roomPhotos,
        _id: room._id,
        isNewRoom: room.isNewRoom,
      })),
    });

    router.push({
      pathname: "/(secure)/(hostelService)/addNewHostelService1",
      params: {
        mode: mode,
        hostelId: hostelId || "",
      },
    });
  }, [
    validateForm,
    hostelName,
    description,
    hostelType,
    pricePerDay,
    weeklyPrice,
    monthlyPrice,
    securityDeposit,
    offers,
    amenities,
    rooms,
    setFormPage1Data,
    router,
    mode,
    hostelId,
  ]);

  const resetForm = useCallback(() => {
    Alert.alert("Reset Form", "Are you sure you want to reset all fields?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setHostelName("");
          setDescription("");
          setHostelType("boys");
          setPricePerDay(0);
          setMonthlyPrice(0);
          setWeeklyPrice(0);
          setSecurityDeposit(0);
          setOffers("");
          setRooms([
            {
              id: "1",
              roomNo: "",
              noOfBeds: 0,
              roomDetails: "",
              roomPhotos: [],
            },
          ]);
          setActiveRoomId("1");
          setAmenities({
            wifi: false,
            meals: false,
            security: false,
            studyHall: false,
            commonTV: false,
            cctv: false,
            acRooms: false,
            laundry: false,
          });
          clearFormData();
        },
      },
    ]);
  }, [clearFormData]);

  const toggleAmenity = useCallback((amenity: string) => {
    setAmenities((prev) => ({
      ...prev,
      [amenity]: !prev[amenity as keyof typeof prev],
    }));
  }, []);

  const renderAmenityCheckbox = useCallback(
    (icon: string, label: string, amenityKey: string) => {
      const isChecked = amenities[amenityKey as keyof typeof amenities];

      return (
        <TouchableOpacity
          key={amenityKey}
          style={styles.amenityItem}
          onPress={() => toggleAmenity(amenityKey)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && (
              <Ionicons name="checkmark" size={14} color={Colors.white} />
            )}
          </View>

          <Ionicons
            name={icon as any}
            size={18}
            color={isChecked ? "#FF6B35" : "#6B7280"}
            style={styles.amenityIcon}
          />
          <Text
            style={[
              styles.amenityLabel,
              isChecked
                ? styles.amenityLabelActive
                : styles.amenityLabelInactive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    },
    [amenities, toggleAmenity]
  );

  const renderRoomCard = useCallback(
    (room: RoomData, index: number) => {
      const isActive = activeRoomId === room.id;
      const photosCount = room.roomPhotos.length;
      const photosNeeded = Math.max(0, MINIMUM_PHOTOS_PER_ROOM - photosCount);

      return (
        <View key={room.id} style={styles.roomCard}>
          <TouchableOpacity
            style={styles.roomHeader}
            onPress={() => setActiveRoomId(isActive ? "" : room.id)}
            activeOpacity={0.7}
          >
            <View style={styles.roomHeaderLeft}>
              <Ionicons name="bed-outline" size={20} color="#374151" />
              <Text style={styles.roomHeaderText}>
                {room.roomNo
                  ? `Room ${room.roomNo}`
                  : `Room ${index + 1} (Not Set)`}
              </Text>
              {photosCount < MINIMUM_PHOTOS_PER_ROOM &&
                (!isUpdatingHostel || room.isNewRoom) && (
                  <View style={styles.warningBadge}>
                    <Ionicons name="warning" size={12} color="#EF4444" />
                    <Text style={styles.warningText}>
                      {photosNeeded} photos needed
                    </Text>
                  </View>
                )}
              {isUpdatingHostel && !room.isNewRoom && (
                <View style={styles.existingBadge}>
                  <Text style={styles.existingBadgeText}>Existing</Text>
                </View>
              )}
            </View>
            <View style={styles.roomHeaderRight}>
              {rooms.length > 1 && (
                <TouchableOpacity
                  onPress={() => deleteRoom(room.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
              <Ionicons
                name={isActive ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6B7280"
              />
            </View>
          </TouchableOpacity>

          {isActive && (
            <View style={styles.roomContent}>
              <View style={styles.photosSection}>
                <View style={styles.photosContainer}>
                  <Ionicons name="camera-outline" size={20} color="#6B7280" />
                  <Text style={styles.photosLabel}>
                    Photos * (Min {MINIMUM_PHOTOS_PER_ROOM}, Max{" "}
                    {MAXIMUM_PHOTOS_PER_ROOM})
                  </Text>
                  <View style={styles.photoCountBadge}>
                    <Text style={styles.photoCountText}>
                      {photosCount}/{MAXIMUM_PHOTOS_PER_ROOM}
                    </Text>
                  </View>
                </View>

                {room.roomPhotos.length > 0 && (
                  <View style={styles.photosGrid}>
                    {room.roomPhotos.map((photo, photoIndex) => (
                      <View key={photoIndex} style={styles.photoContainer}>
                        <Image
                          source={{ uri: photo.uri }}
                          style={styles.photoPreview}
                        />
                        <TouchableOpacity
                          style={styles.removePhotoButton}
                          onPress={() => removeRoomPhoto(room.id, photoIndex)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={24}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {room.roomPhotos.length < MAXIMUM_PHOTOS_PER_ROOM && (
                  <>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={() => pickRoomImage(room.id)}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={32}
                        color="#6B7280"
                      />
                      <Text style={styles.uploadText}>Upload photo</Text>
                      <Text style={styles.uploadSubtext}>
                        {photosCount === 0
                          ? `Upload at least ${MINIMUM_PHOTOS_PER_ROOM} clear photos`
                          : `${photosNeeded} more photo${
                              photosNeeded !== 1 ? "s" : ""
                            } needed`}
                      </Text>
                    </TouchableOpacity>

                    {room.roomPhotos.length > 0 &&
                      room.roomPhotos.length < MAXIMUM_PHOTOS_PER_ROOM && (
                        <TouchableOpacity
                          style={styles.addMorePhotos}
                          onPress={() => pickRoomImage(room.id)}
                        >
                          <Text style={styles.addMorePhotosText}>
                            + Add More Image
                          </Text>
                        </TouchableOpacity>
                      )}
                  </>
                )}
              </View>

              <View style={styles.roomDetailsRow}>
                <View style={styles.roomNoContainer}>
                  <Text style={styles.inputLabel}>Room No *</Text>
                  <View style={styles.roomNoInput}>
                    <LabeledInput
                      placeholder="101"
                      value={room.roomNo}
                      onChangeText={(text) =>
                        updateRoomField(room.id, "roomNo", text)
                      }
                      inputContainerStyle={styles.roomNoInputBox}
                      containerStyle={styles.noPadding}
                    />
                  </View>
                </View>

                <View style={styles.bedsContainer}>
                  <StepperInput
                    label="No of Beds *"
                    value={room.noOfBeds}
                    onChange={(value) =>
                      updateRoomField(room.id, "noOfBeds", value)
                    }
                    step={1}
                    showCurrency={false}
                  />
                </View>
              </View>

              <LabeledInput
                label="Room Details *"
                placeholder="Enter room details (e.g., attached bathroom, balcony, AC, etc.)"
                value={room.roomDetails}
                onChangeText={(text) =>
                  updateRoomField(room.id, "roomDetails", text)
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                labelStyle={styles.inputLabel}
                inputContainerStyle={styles.textArea}
                containerStyle={styles.roomDetailsInput}
                inputStyle={styles.textAreaInput}
              />
            </View>
          )}
        </View>
      );
    },
    [
      activeRoomId,
      rooms,
      pickRoomImage,
      removeRoomPhoto,
      deleteRoom,
      updateRoomField,
      isUpdatingHostel,
    ]
  );

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading hostel data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerWrapper}>
          <CommonHeader
            title={
              isUpdatingHostel
                ? "Edit Hostel Service"
                : "Add New Hostel Service"
            }
            actionText="Reset"
            onActionPress={resetForm}
          />
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="document-text-outline" size={20} color="#374151" />
            <Text style={[styles.sectionHeader, styles.marginLeft8]}>
              Basic Information
            </Text>
          </View>

          <LabeledInput
            label="PG/Hostel Name *"
            placeholder="e.g., Scholars Den Boys Hostel"
            value={hostelName}
            onChangeText={setHostelName}
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputBox}
          />

          <Text style={[styles.inputLabel, styles.marginTop16]}>
            Hostel Type *
          </Text>
          <CommonDropdown
            items={[
              { label: "Select Hostel Type", value: "" },
              { label: "Boys Hostel", value: "boys" },
              { label: "Girls Hostel", value: "girls" },
              { label: "Co-ed Hostel", value: "coed" },
            ]}
            value={hostelType}
            setValue={setHostelType}
            placeholder="Select Hostel Type"
          />

          <LabeledInput
            label="Description *"
            placeholder="Describe your hostel, amenities, and what makes it special (min 20 characters)..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.textArea}
            containerStyle={styles.descContainer}
            inputStyle={styles.textAreaInput}
          />
        </View>

        <View style={[styles.card, styles.noHorizontalPadding]}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={[styles.sectionHeader, styles.paddingHorizontal14]}>
              ₹ Pricing
            </Text>
          </View>

          <Text style={[styles.pricingNote, styles.paddingHorizontal14]}>
            * Enter at least one pricing option (Daily, Weekly, or Monthly)
          </Text>

          <View style={styles.pricingRow}>
            <StepperInput
              label="Price per Day (₹)"
              value={pricePerDay}
              onChange={setPricePerDay}
              step={50}
              min={0}
              max={50000}
            />
            <StepperInput
              label="Weekly Price (₹)"
              value={weeklyPrice}
              onChange={setWeeklyPrice}
              step={100}
              min={0}
              max={50000}
            />
          </View>

          <View style={styles.pricingRow}>
            <StepperInput
              label="Monthly Price (₹)"
              value={monthlyPrice}
              onChange={setMonthlyPrice}
              step={500}
              min={0}
              max={50000}
            />
            <StepperInput
              label="Security Deposit (₹) *"
              value={securityDeposit}
              onChange={setSecurityDeposit}
              step={500}
              min={0}
              max={100000}
            />
          </View>

          <LabeledInput
            label="Offers (Optional)"
            placeholder="e.g., 10% discount on 6 months advance"
            value={offers}
            onChangeText={setOffers}
            labelStyle={styles.inputLabel}
            inputContainerStyle={styles.inputBox}
            containerStyle={styles.offersContainer}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="bed-outline" size={20} color="#374151" />
            <Text style={[styles.sectionHeader, styles.marginLeft8]}>
              Rooms & Bed
            </Text>
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>{rooms.length}</Text>
            </View>
          </View>

          {rooms.map((room, index) => renderRoomCard(room, index))}

          <TouchableOpacity
            style={styles.addMoreRoomButton}
            onPress={addMoreRoom}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FF6B35" />
            <Text style={styles.addMoreRoomText}>Add More Room</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeaderContainer}>
            <Ionicons name="star-outline" size={20} color="#374151" />
            <Text style={[styles.sectionHeader, styles.marginLeft8]}>
              Facilities & Amenities
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Select features that apply to your hostel
          </Text>

          <View style={styles.amenitiesGrid}>
            {renderAmenityCheckbox("wifi", "WiFi", "wifi")}
            {renderAmenityCheckbox("restaurant", "Meals", "meals")}
            {renderAmenityCheckbox("shield-checkmark", "Security", "security")}
            {renderAmenityCheckbox("book", "Study Hall", "studyHall")}
            {renderAmenityCheckbox("tv", "Common TV", "commonTV")}
            {renderAmenityCheckbox("videocam", "CCTV", "cctv")}
            {renderAmenityCheckbox("snow", "AC Rooms", "acRooms")}
            {renderAmenityCheckbox("shirt", "Laundry", "laundry")}
          </View>
        </View>

        <CommonButton
          title="Next"
          onPress={handleNext}
          buttonStyle={styles.nextButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { backgroundColor: Colors.white },
  headerWrapper: { backgroundColor: Colors.white },
  container: { padding: 10, paddingBottom: 30, backgroundColor: Colors.white },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontFamily: fonts.interMedium,
  },
  card: {
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  marginLeft8: { marginLeft: 8 },
  marginTop16: { marginTop: 16 },
  noHorizontalPadding: { paddingHorizontal: 0 },
  paddingHorizontal14: { paddingHorizontal: 14 },
  sectionHeader: {
    fontSize: 18,
    fontFamily: fonts.interBold,
    color: "#111827",
  },
  inputLabel: {
    color: "#374151",
    fontSize: 14,
    fontFamily: fonts.interMedium,
    marginBottom: 8,
  },
  inputContainer: { marginTop: 12, paddingHorizontal: 0 },
  inputBox: {
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    height: 48,
    borderRadius: 8,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    borderRadius: 8,
  },
  descContainer: {
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 13,
    lineHeight: 20,
  },
  pricingNote: {
    fontSize: 12,
    color: "#FF6B35",
    marginBottom: 12,
    fontFamily: fonts.interMedium,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  offersContainer: { marginTop: 4, paddingHorizontal: 14 },
  roomBadge: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: "auto",
  },
  roomBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: fonts.interSemibold,
  },
  roomCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  roomHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  roomHeaderText: {
    fontSize: 16,
    fontFamily: fonts.interSemibold,
    color: "#111827",
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
    gap: 4,
  },
  warningText: {
    fontSize: 10,
    color: "#EF4444",
    fontFamily: fonts.interMedium,
  },
  existingBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  existingBadgeText: {
    fontSize: 10,
    color: "#1E40AF",
    fontFamily: fonts.interMedium,
  },
  roomHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    padding: 4,
  },
  roomContent: {
    padding: 16,
    minHeight: 100,
  },
  photosSection: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  photosContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  photosLabel: {
    fontSize: 14,
    fontFamily: fonts.interMedium,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
  },
  photoCountBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 11,
    color: Colors.white,
    fontFamily: fonts.interSemibold,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  photoContainer: {
    position: "relative",
    width: 80,
    height: 80,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  uploadText: {
    color: "#374151",
    fontFamily: fonts.interMedium,
    fontSize: 14,
    marginTop: 8,
  },
  uploadSubtext: {
    color: "#9CA3AF",
    fontFamily: fonts.interRegular,
    fontSize: 12,
    marginTop: 4,
  },
  addMorePhotos: { alignSelf: "center" },
  addMorePhotosText: {
    color: "#FF6B35",
    fontFamily: fonts.interSemibold,
    fontSize: 14,
  },
  roomDetailsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  roomNoContainer: {
    flex: 1,
  },
  bedsContainer: {
    flex: 1,
  },
  roomNoInput: {
    flex: 1,
  },
  roomNoInputBox: {
    backgroundColor: "#fff",
    borderColor: "#A5A5A5",
    borderWidth: 0.5,
    height: 48,
    borderRadius: 8,
  },
  noPadding: {
    paddingHorizontal: 0,
    marginTop: 0,
  },
  roomDetailsInput: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  addMoreRoomButton: {
    borderWidth: 1,
    borderColor: "#FF6B35",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    backgroundColor: "#FFF5F0",
  },
  addMoreRoomText: {
    color: "#FF6B35",
    fontFamily: fonts.interSemibold,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    fontFamily: fonts.interRegular,
  },
  amenitiesGrid: { marginTop: 8 },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#A5A5A5",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  amenityIcon: { marginRight: 8 },
  amenityLabel: {
    fontSize: 14,
    fontFamily: fonts.interRegular,
  },
  amenityLabelActive: { color: "#FF6B35" },
  amenityLabelInactive: { color: "#6B7280" },
  nextButton: { borderRadius: 8 },
});

export default AddNewHostelService;
