import SearchBar from "../../Components/SearchBar/SearchBar";
import Card from "../../Components/Card/Card";
import Draggable from "react-native-draggable";
import { StatusBar } from "expo-status-bar";
import ReviewModal from "../../Components/ReviewModal/ReviewModal";
import { Dimensions, FlatList, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { createTable, fetchRecentCigarItems } from "../../Database/db-service";
import { cigarItem } from "../../Database/models";

const Home = () => {
  const windowWidth = Dimensions.get("window").width / 1.3;
  const windowHeight = Dimensions.get("window").height / 1.15;
  const [modalOpen, setModalOpen] = useState(false);
  const [cigarItems, setCigarItems] = useState<cigarItem[]>([]);
  const [currentlySelectedCigar, setCurrentlySelectedCigar] =
    useState<cigarItem | null>(null);

  const db = useSQLiteContext();

  async function getRecentCigars() {
    await createTable(db);
    const cigars: cigarItem[] = await fetchRecentCigarItems(db);
    setCigarItems(cigars);
  }

  useEffect(() => {
    getRecentCigars();
  }, []);

  useEffect(() => {
    //todo better refresh
    getRecentCigars();
  }, [modalOpen]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar setCigars={(cigars: cigarItem[]) => setCigarItems(cigars)} />
      <FlatList
        data={cigarItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            cigarItem={item}
            openModal={(cigarItem) => {
              setCurrentlySelectedCigar(cigarItem);
              setModalOpen(true);
            }}
          />
        )}
      />
      <Draggable
        x={windowWidth}
        y={windowHeight}
        renderSize={56}
        renderColor="brown"
        renderText="+"
        isCircle
        shouldReverse={false}
        onShortPressRelease={() => setModalOpen(true)}
      />
      <StatusBar style="auto" />
      {modalOpen && (
        <ReviewModal
          isOpen={modalOpen}
          closeModal={() => {
            setCurrentlySelectedCigar(null);
            setModalOpen(false);
          }}
          cigarItem={currentlySelectedCigar}
        />
      )}
    </SafeAreaView>
  );
};
export default Home;
