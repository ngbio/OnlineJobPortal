import { Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../utils/contexts/MyContext";
import { authApis, endpoints } from "../../utils/Apis";

const JobDetail = () => {
    const route = useRoute();
    const nav = useNavigation();
    const [user,] = useContext(MyContext);
    const  {job}  = route.params;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user === null) {
            nav.navigate("HomeScreen"); 
        }
    }, [user]);

const handleDelete = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn xóa bài đăng này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", 
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const res = await authApis(user.access_token).delete(endpoints['delete_job'](job?.id));

                            if (res.status === 200) {
                                Alert.alert("Thông báo", "Đã xóa tin tuyển dụng thành công!");
                                nav.goBack(); 
                            }
                        } catch (ex) {
                            console.error(ex);
                            Alert.alert("Lỗi", "Không thể xóa bài đăng. Vui lòng thử lại!");
                        } finally {
                            setLoading(false);
                        }
                    } 
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{job?.name}</Text>
            <Text style={styles.company}>{job?.company}</Text>

            <Text style={styles.label}>Mô tả công việc</Text>
            <Text>{job?.description}</Text>
            <Text style={styles.label}>Yêu cầu</Text>
            <Text>{job?.request}</Text>

            <Text style={styles.label}>Mức lương</Text>
            <Text>{job?.salary}</Text>

            <Text style={styles.label}>Địa chỉ</Text>
            <Text>{job?.address}</Text>

            <Text style={styles.label}>Quyền lợi</Text>
            <Text>{job?.benefits}</Text>

            {user.role === "candidate" && (
                <Button
                    mode="contained"
                    style={styles.btn}
                    onPress={() => nav.navigate("Apply", { jobId: job?.id })}
                >
                    Ứng tuyển
                </Button>
            )}
            {user.role === "employer" && (
                <Button
                    mode="outlined"
                    style={styles.btn}
                    onPress={() =>
                        nav.navigate("Application",{"jobId": job?.id})
                    }
                >
                    Xem chi tiết đơn ứng tuyển
                </Button>
            )}
            {user.role === "employer" && (
                <Button
                    mode="outlined"
                    style={styles.btn}
                    onPress={() =>
                        nav.navigate("UpdateJob", { jobId: job?.id })
                    }
                >
                    Cập nhật tin tuyển dụng
                </Button>
            )}
            {user.role === "employer" && (
                    <Button mode="contained" buttonColor="red" textColor="white" style={styles.btn}
                        loading={loading}
                        disabled={loading}
                        onPress={handleDelete}>
                        Xóa tin tuyển dụng
                    </Button>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 15 },
    title: { fontSize: 22, fontWeight: "bold" },
    company: { fontSize: 16, color: "#666", marginBottom: 10 },
    label: { marginTop: 15, fontWeight: "bold" },
    btn: { marginTop: 30 }
});

export default JobDetail;
