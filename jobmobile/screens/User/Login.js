import { ScrollView, Text, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../../utils/contexts/MyContext";



const Login = () => {
    const info = [{
        title: "Tên đăng nhập",
        field: "username",
        icon: "account"
    }, {
        title: "Mật khẩu",
        field: "password",
        icon: "eye",
        secureTextEntry: true
    }];

    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [, dispatch] = useContext(MyContext);



    const validate = () => {
        return true;
    }

    const login = async () => {
        if (validate() === true) {
            try {
                setLoading(true);

                const form = new URLSearchParams();
                form.append("username", user.username);
                form.append("password", user.password);
                form.append("client_id", "UY29nbKGK0RYOoXXzkugo75XADhdeFc92P1cqyr1");
                form.append("client_secret", "LNDoJCPw3WBdohgniA13XjtwvzVQGomuw0jUerIwZxjxBr5IRWc50l9ZryCINmuDddFVPUPATUXV2xORutOmRYq1iuiEc3fDl1wZ7qPxPy8WJPV0TbadZpRPS9RO59x1");
                form.append("grant_type", "password");

                let res = await Apis.post(endpoints["login"], form,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );

                console.log("TOKEN:", res.data);
                AsyncStorage.setItem('access_token', res.data.access_token);

                setTimeout(async () => {
                    let user = await authApis(res.data.access_token).get(endpoints['current_user']);
                    console.log(user.data);

                    dispatch({
                        'type': 'login',
                        'payload': {
                            ...user.data,
                            'access_token': res.data.access_token
                        }
                    });

                }, 500);

                nav.navigate("Home", { screen: 'HomeScreen' });
            } catch (ex) {
                console.error(ex);
                alert("Đăng nhập không thành công!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={MyStyles.title}>Login</Text>
            <ScrollView>
                <HelperText type="error" visible={err}>
                    Mật khẩu không khớp!
                </HelperText>
                {info.map(i => <TextInput key={i.field} style={MyStyles.margin}
                    value={user[i.field]}
                    onChangeText={(text) => setUser({ ...user, [i.field]: text })}
                    label={i.title}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                />)}

            </ScrollView>
            <Button loading={loading} disabled={loading} icon="login" mode="contained" title="Đăng nhập" onPress={login} style={MyStyles.margin}>
                Đăng nhập
            </Button>
        </View>
    );
}

export default Login;