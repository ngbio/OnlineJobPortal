import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { Button, HelperText, TextInput, Chip } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyContext } from "../../utils/contexts/MyContext";

const UpdateJob = () => {
    const route = useRoute();
    const  jobId  = route.params?.jobId; // Lấy ID bài đăng cần sửa truyền từ màn hình quản lý
    const nav = useNavigation();
    const [user] = useContext(MyContext);

    const info = [
        { title: "Tên công việc", field: "name", icon: "briefcase" },
        { title: "Tên công ty", field: "company", icon: "office-building" },
        { title: "Mức lương", field: "salary", icon: "cash", keyboard: "numeric" },
        { title: "Địa chỉ", field: "address", icon: "map-marker" },
        { title: "Mô tả công việc", field: "description", icon: "text-long", multiline: true },
        { title: "Yêu cầu", field: "request", icon: "clipboard-list", multiline: true },
        { title: "Quyền lợi", field: "benefits", icon: "gift", multiline: true },
    ];

    const [jobData, setJobData] = useState({});
    const [categories, setCategories] = useState([]);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true); // Trạng thái đang tải dữ liệu cũ

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Load danh mục
                const resCate = await Apis.get(endpoints['categories']);
                setCategories(resCate.data);

            } catch (ex) {
                console.error("Lỗi load dữ liệu:", ex);
            } finally {
                setFetching(false);
            }
        };
        loadInitialData();
    }, [jobId]);

    const validate = () => {
        if (!jobData.name || !jobData.company || !jobData.category_id) {
            setErr(true);
            return false;
        }
        setErr(false);
        return true;
    };

    const handleUpdate = async () => {
        if (validate()) {
            try {
                setLoading(true);
                // Sử dụng PATCH để cập nhật một phần dữ liệu
                const res = await authApis(user.access_token).patch(
                    `${endpoints['update_job'](jobId)}`, 
                    jobData
                );

                if (res.status === 200) {
                    alert("Cập nhật thành công!");
                    nav.goBack();
                }
            } catch (ex) {
                console.error(ex.response?.data || ex.message);
                alert("Cập nhật thất bại!");
            } finally {
                setLoading(false);
            }
        }
    };

    if (fetching) 
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#6200ee" />;

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
            <Text style={[MyStyles.title, { textAlign: 'center', marginBottom: 10 }]}>Chỉnh sửa tin</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <HelperText type="error" visible={err}>
                    Các trường (*) không được để trống!
                </HelperText>

                {info.map(i => (
                    <TextInput key={i.field} style={MyStyles.margin} 
                        value={String(jobData[i.field] || "")} // Ép kiểu string để TextInput không lỗi
                        onChangeText={(text) => setJobData({ ...jobData, [i.field]: text })}
                        label={i.title}
                        mode="outlined"
                        multiline={i.multiline || false}
                        numberOfLines={i.multiline ? 3 : 1}
                        keyboardType={i.keyboard || "default"}
                        right={<TextInput.Icon icon={i.icon} />}
                    />
                ))}

                <Text style={[MyStyles.margin, { fontWeight: 'bold', marginTop: 15 }]}>Ngành nghề *</Text>
                <View style={styles.categoryContainer}>
                    {categories.map(c => (
                        <Chip key={c.id} style={styles.chip} 
                            selected={jobData.category_id === c.id}
                            onPress={() => setJobData({ ...jobData, "category_id": c.id })}
                            selectedColor="black"
                            buttonColor={jobData.category_id === c.id ? "#6200ee" : "#f0f0f0"}>
                            {c.name}
                        </Chip>
                    ))}
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>

            <Button
                loading={loading}
                disabled={loading}
                icon="content-save-edit"
                mode="contained"
                onPress={handleUpdate}
                style={[MyStyles.margin, { paddingVertical: 5 }]}>
                Lưu thay đổi
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
    chip: { marginRight: 5, marginBottom: 8 }
});

export default UpdateJob;