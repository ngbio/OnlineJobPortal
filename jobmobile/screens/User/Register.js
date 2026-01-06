import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput, RadioButton } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import Apis, { endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const info = [{
        title: "Tên đăng nhập",
        field: "username",
        icon: "account"
    }, {
        title: "Mật khẩu",
        field: "password",
        icon: "eye",
        secureTextEntry: true
    }, {
        title: "Xác nhận mật khẩu",
        field: "confirm",
        icon: "eye",
        secureTextEntry: true
    }, {
        title: "email",
        field: "email",
        icon: "email"
    }, {
        title: "Tên",
        field: "first_name",
        icon: "text"
    }, {
        title: "Họ và tên lót",
        field: "last_name",
        icon: "text"
    }];

    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Permission to access media library is required!');
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                setUser({ ...user, "avatar": result.assets[0] });
            }
        }
    }

    const validate = () => {
        if (!user.password || user.password !== user.confirm) {
            setErr(true);
            return false;
        }

        if (!user.role) {
            alert("Vui lòng chọn role!");
            return false;
        }

        setErr(false);
        return true;
    }

    const register = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let form = new FormData();
                for (let key in user) {
                    if (key === "confirm") continue;

                    if (key === "avatar" && user.avatar) {
                        form.append("avatar", {
                            uri: user.avatar.uri,
                            name: 'avatar.jpg',
                            type: 'image/jpeg'
                        });
                    } else {
                        form.append(key, user[key]);
                    }
                }

                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201) {
                    alert("Đăng ký thành công!");
                    nav.navigate("Login");
                } else {
                    alert("Đăng ký thất bại!");
                    nav.navigate("Register");
                }
            } catch (ex) {
                console.error(ex);
                alert("Có lỗi xảy ra!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={{flex: 1, padding: 10}}>
            <Text style={MyStyles.title}>Register</Text>
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

                {/* Choice role UI */}
                <View style={MyStyles.margin}>
                    <Text style={{ marginBottom: 5 }}>Bạn là:</Text>
                    <RadioButton.Group
                        onValueChange={v => setUser({ ...user, role: v })}
                        value={user.role}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton value="candidate" />
                            <Text>Người tìm việc</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <RadioButton value="employer" />
                            <Text>Nhà tuyển dụng</Text>
                        </View>
                    </RadioButton.Group>
                </View>

                <TouchableOpacity style={MyStyles.margin} onPress={pickImage}>
                    <Text>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>

                {user.avatar && <Image source={{ uri: user.avatar.uri }} style={MyStyles.avatar} />}



            </ScrollView>
            <Button loading={loading} disabled={loading} icon="account-plus" mode="contained" title="Đăng ký" onPress={register} style={MyStyles.margin}>
                Đăng ký
            </Button>
        </View>
    );
}

export default Register;