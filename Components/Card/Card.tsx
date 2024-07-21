import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { cigarItem } from "../../Database/models";

const Card = (props: { cigarItem: cigarItem }) => {
  const calculateAverageRating = () => {
    let totalRating = 0;
    let count = 0;

    const ratings = [
      props.cigarItem.drawRating,
      props.cigarItem.appearanceRating,
      props.cigarItem.burnRating,
      props.cigarItem.aromaRating,
      props.cigarItem.tasteRating,
    ];

    ratings.forEach((rating) => {
      if (rating !== 0) {
        totalRating += rating;
        count++;
      }
    });

    return count > 0 ? totalRating / count : 0;
  };

  return (
    <TouchableOpacity style={styles.touchable}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={{
              uri: props.cigarItem.image,
            }}
          />
          <Text style={styles.textXl}>{props.cigarItem.cigarName}</Text>
        </View>
        <View style={styles.stars}>
          <StarRatingDisplay rating={calculateAverageRating()} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  content: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginRight: 20,
  },
  stars: {
    marginTop: 10,
  },
  textXl: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Card;
