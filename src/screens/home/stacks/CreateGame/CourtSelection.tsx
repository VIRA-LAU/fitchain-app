export const CourtSelection = () => {
  return (
    <View style={{ marginBottom: 16 }}>
      {selectedBranch?.courts.map((court, index) => (
        <CourtCard
          key={index}
          name={court.name}
          price={court.price}
          rating={court.rating}
          type={court.courtType}
          venueName={selectedBranch.venue.name}
          isSelected={selectedCourt?.id === court.id}
          onPress={() => {
            setSelectedCourt(court);
          }}
        />
      ))}
    </View>
  );
};
