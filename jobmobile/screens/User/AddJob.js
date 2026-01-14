import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput, Chip } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import { MyContext } from "../../utils/contexts/MyContext";

const AddJob = () => {
    const info = [
        { title: "Tên công việc", 
            field: "name", 
            icon: "briefcase" },
        { title: "Tên công ty", 
            field: "company", 
            icon: "office-building" },
        { title: "Mức lương", 
            field: "salary", 
            icon: "cash", 
            keyboard: "numeric" },
        { title: "Địa chỉ", field: "address", icon: "map-marker" },
        { title: "Mô tả công việc", field: "description", icon: "text-long", multiline: true },
        { title: "Yêu cầu", field: "request", icon: "clipboard-list", multiline: true },
        { title: "Quyền lợi", field: "benefits", icon: "gift", multiline: true },
    ];

    const [jobData, setJobData] = useState({});
    const [categories, setCategories] = useState([]);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyContext);
    const nav = useNavigation();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await Apis.get(endpoints['categories']);
                setCategories(res.data);
            } catch (ex) {
                console.error("Lỗi load categories:", ex);
            }
        };
        loadCategories();
    }, []);

    const validate = () => {
        if (!jobData.name || !jobData.company || !jobData.category_id) {
            setErr(true);
            return false;
        }
        setErr(false);
        return true;
    };

    const submit = async () => {
        if (validate()) {
            try {
                setLoading(true);

                const res = await authApis(user.access_token).post(`${endpoints['job_posts']}add_job/`, jobData);

                if (res.status === 201 || res.status === 200) {
                    alert("Đăng tin thành công!");
                    nav.goBack();
                }
            } catch (ex) {
                console.error(ex.response?.data || ex.message);
                alert("Đăng tin thất bại!");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
            <Text style={[MyStyles.title, { textAlign: 'center', marginBottom: 10 }]}>Đăng tin tuyển dụng</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <HelperText type="error" visible={err}>
                    Vui lòng nhập đầy đủ!
                </HelperText>

                {info.map(i => (
                    <TextInput key={i.field} style={MyStyles.margin} value={jobData[i.field]}
                        onChangeText={(text) => setJobData({ ...jobData, [i.field]: text })}
                        label={i.title}
                        mode="outlined"
                        multiline={i.multiline || false}
                        numberOfLines={i.multiline ? 3 : 1}
                        keyboardType={i.keyboard || "default"}
                        right={<TextInput.Icon icon={i.icon} />}
                    />
                ))}

                <Text style={[MyStyles.margin, { fontWeight: 'bold', marginTop: 15 }]}>Chọn ngành nghề *</Text>
                <View style={styles.categoryContainer}>
                    {categories.map(c => (
                        <Chip key={c.id} style={styles.chip} selected={jobData.category_id === c.id}
                            onPress={() => setJobData({ ...jobData, "category_id": c.id })}
                            selectedColor="black">
                            {c.name}
                        </Chip>
                    ))}
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>

            <Button
                loading={loading}
                disabled={loading}
                icon="plus-circle"
                mode="contained"
                onPress={submit}
                style={[MyStyles.margin, { paddingVertical: 5 }]}>
                Đăng tin ngay
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    chip: {
        marginRight: 5,
        marginBottom: 8,
    }
});

export default AddJob;