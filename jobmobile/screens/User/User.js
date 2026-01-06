import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useContext } from "react";
import { MyContext } from "../../utils/contexts/MyContext";
import MyStyles from "../../styles/MyStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const User = () => {
    const [,dispatch] = useContext (MyContext);

    const logout = async () => {
        await AsyncStorage.removeItem ('access_token');
        dispatch({'type': 'logout'});
    }
    
    return (
        <View style= {MyStyles.padding}>
            <Text style={MyStyles.title}>Profile</Text>

            <Button mode="contained-tonal" icon="logout" onPress={logout} style={MyStyles.margin}>
                Đăng xuất
            </Button>
        </View>
    );
}

export default User;