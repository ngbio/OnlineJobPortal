import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles"; // Đảm bảo đường dẫn này đúng
import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { Button, Card, List, TextInput } from "react-native-paper";
import { MyContext } from "../../utils/contexts/MyContext";
import { useNavigation } from "@react-navigation/native";

const ApplicationDetail = ({ route }) => {
    const applicationId = route.params?.applicationId; // Lấy ID từ màn hình danh sách
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyContext);
    const nav = useNavigation();
    const [content, setContent] = useState("");


    // 1. Load chi tiết đơn ứng tuyển (Nếu bạn có endpoint chi tiết)

    // 2. Load danh sách comment
    const loadComments = async () => {
        try {
            let res = await authApis(user.access_token).get(endpoints['comments'](applicationId));
            // Nếu backend có phân trang thì dùng res.data.results, không thì res.data
            setComments(res.data.results || res.data);
        } catch (ex) {
            console.error("Lỗi load comments:", ex);
        }
    }

    // 3. Thêm comment mới
    const addComment = async () => {
        if (!content.trim()) return;

        try {
            let res = await authApis(user.access_token).post(endpoints['comments'](applicationId), {
                "content": content
            });
            // Thêm comment mới vào đầu danh sách hiện tại
            setComments([res.data, ...comments]);
            setContent(""); // Xóa nội dung ô nhập
        } catch (ex) {
            console.error("Lỗi thêm comment:", ex);
            alert("Không thể thêm bình luận!");
        }
    }

    useEffect(() => {
        // loadApplicationDetail(); // Mở ra nếu bạn cần hiện thông tin Job ở trên
        loadComments();
    }, [applicationId]);

    return (
        <View style={{ flex: 1 }}>
            <Text style={MyStyles.title}>ĐÁNH GIÁ HỒ SƠ ỨNG TUYỂN</Text>

            <ScrollView style={{ padding: 10 }}>
                {loading && <ActivityIndicator size="large" color="blue" />}

                {user.role == "employer"&& (
                    <View style={{ marginBottom: 20 }}>
                        <TextInput
                            label="Nội dung phản hồi..."
                            value={content}
                            onChangeText={setContent}
                            mode="outlined"
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={addComment}
                            disabled={!content}
                        >
                            Gửi phản hồi
                        </Button>
                    </View>
                )}
                {/* Danh sách bình luận dùng MAP y chang yêu cầu */}
                <View style={{ marginBottom: 30 }}>
                    {comments && comments.map(c => (
                        <List.Item
                            key={c.id}
                            title={c.user?.first_name || c.user?.username }
                            description={c.content}
                            titleNumberOfLines={5}
                            left={props => (
                                <View style={MyStyles.circleIcon}>
                                    <List.Icon icon="account" color="white" size={100} />
                                </View>
                            )}
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default ApplicationDetail;