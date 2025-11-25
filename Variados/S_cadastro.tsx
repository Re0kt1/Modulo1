import { StyleSheet } from 'react-native'

export default StyleSheet.create({

    container: {
    flex: 1,
    backgroundColor: '#c6d5d6d2',
  },
  Icontainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "50%",
  },
  input:{
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: '80%',
    backgroundColor: '#fff',
  },
  bemVindo:{
     fontSize: 18,
     marginBottom: 10,
     color: "green",
  },
  nomeTopo:{
    fontSize: 20,
    fontWeight: "bold",
  },
  logo:{
  marginTop: 100,
  width: 300,
  height: 300,
  alignSelf: "center",
  borderRadius: 130,
  }
})