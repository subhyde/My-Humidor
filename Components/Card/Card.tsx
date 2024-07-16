import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const Card = () => {
  return (
    <TouchableOpacity style={styles.touchable}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{
            uri: "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-1200x675.webp",
          }}
        />
        <Text style={styles.textXl}>cigar name</Text>
      </View>
      <Text style={styles.text}>cigar rating</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center", // optional, to align items vertically in the center
  },
  touchable: {
    width: `90%`,
    padding: 20,
    margin: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 10,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  textXl: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  text: {
    color: "#000",
  },
});

export default Card;
