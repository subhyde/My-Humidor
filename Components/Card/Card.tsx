import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { cigarItem } from "../../Database/models";

const Card = (props: {
  cigarItem: cigarItem;
  openModal: (cigarItem: cigarItem) => void;
}) => {
  const calculateAverageRating = () => {
    const ratings = [
      props.cigarItem.drawRating,
      props.cigarItem.appearanceRating,
      props.cigarItem.burnRating,
      props.cigarItem.aromaRating,
      props.cigarItem.tasteRating,
    ];

    const totalRating = ratings.reduce((acc, rating) => acc + rating, 0);
    const count = ratings.length;

    return totalRating / count;
  };

  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => props.openModal(props.cigarItem)}
    >
      <View style={styles.content}>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={{
              uri: props.cigarItem.image,
            }}
          />
          <View style={styles.innerCard}>
            <Text style={styles.textXl} numberOfLines={2}>
              {props.cigarItem.cigarName}
            </Text>
            <View style={styles.stars}>
              <StarRatingDisplay
                maxStars={5}
                starSize={28}
                rating={calculateAverageRating()}
              />
            </View>
          </View>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  content: {
    alignItems: "center",
  },
  innerCard: {
    flexShrink: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  stars: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  textXl: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333333",
    fontFamily: "HelveticaNeue-Medium",
    marginBottom: 5,
  },
});

export default Card;
