import { StyleSheet } from 'react-native';

export default StyleSheet.create ({
  container: {
    marginTop: 60
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }, 
  padding: {
    padding: 5
  },
  margin: {
    margin: 5
  }, 
  circleIcon: {
    width: 80,
    height: 80,
    borderRadius: 100,   
    backgroundColor: '#03afffff', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  }, avatar: {
        width: 120,
        height: 120,
        borderRadius: 50,
  }, title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "blue",
        alignSelf: "center"
  },chip: {
    backgroundColor: '#f0f0f0', 
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 13,
    color: '#444',
  }
});