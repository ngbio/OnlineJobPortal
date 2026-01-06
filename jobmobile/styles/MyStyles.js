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
    borderRadius: 100,   // tròn
    backgroundColor: '#03afffff', // xanh đẹp
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
  }
});