import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from "react";
import { authApis, endpoints } from "../../utils/Apis";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyContext } from "../../utils/contexts/MyContext";

const Apply = () => {
    const info = [{
        title: "Họ và tên",
        field: "full_name",
        icon: "account"
    }, {
        title: "Email",
        field: "email",
        icon: "email"
    }, {
        title: "Số điện thoại",
        field: "phone",
        icon: "phone"
    }];
    const [applicant, setApplicant] = useState({});
    const [err, setErr] = useState(false);
    const nav = useNavigation();
    const route = useRoute();
    const { jobId } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyContext);




    const pickCV = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Permission to access media library is required!');
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                setApplicant({ ...applicant, "cv": result.assets[0] });
            }
        }
    }

    const validate = () => {
        if (!applicant.full_name || !applicant.email || !applicant.phone) {
            setErr(true);
            return false;
        }

        setErr(false);
        return true;
    }

    const submit = async () => {
        if (validate() === true) {
            try {
                setLoading(true);
                let form = new FormData();

                for (let key in applicant) {
                    if (key === "cv") {
                        form.append("cv", {
                            uri: applicant.cv.uri,
                            name: 'cv.jpg',
                            type: 'image/jpeg'
                        });
                    } else {
                        form.append(key, applicant[key]);
                    }
                }

                let res = await authApis(user.access_token).post(
                    endpoints['apply_job'](jobId),
                    form,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                if (res.status === 201 || res.status === 200) {
                    alert("Ứng tuyển thành công!");
                    nav.goBack();
                } else {
                    alert("Ứng tuyển thất bại!");
                }
            } catch (ex) {
                if (ex.response) {
                    console.error("Server Error Data:", ex.response.data);
                }
                alert("Ứng tuyển thất bại! " + (ex.response?.data?.detail || ""));
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={MyStyles.title}>Ứng tuyển</Text>
            <ScrollView>
                <HelperText type="error" visible={err}>
                    Vui lòng nhập đầy đủ thông tin và ảnh CV!
                </HelperText>

                {info.map(i => (
                    <TextInput
                        key={i.field}
                        style={MyStyles.margin}
                        value={applicant[i.field]}
                        onChangeText={(text) => setApplicant({ ...applicant, [i.field]: text })}
                        label={i.title}
                        right={<TextInput.Icon icon={i.icon} />}
                    />
                ))}

                <TouchableOpacity style={MyStyles.margin} onPress={pickCV}>
                    <Text style={{ color: 'blue', marginBottom: 10 }}>Chọn ảnh CV (Hồ sơ)...</Text>
                </TouchableOpacity>

                {applicant.cv && (
                    <Image
                        source={{ uri: applicant.cv.uri }}
                        style={{ width: 100, height: 150, borderRadius: 10, marginBottom: 10 }}
                    />
                )}

            </ScrollView>

            <Button
                loading={loading}
                disabled={loading}
                icon="send"
                mode="contained"
                onPress={submit}
                style={MyStyles.margin}
            >
                Gửi hồ sơ
            </Button>
        </View>
    );
}

export default Apply;