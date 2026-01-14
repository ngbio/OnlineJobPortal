import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyles from "../../styles/MyStyles"; 
import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { Button, Card, List, TextInput } from "react-native-paper";
import { MyContext } from "../../utils/contexts/MyContext";
import { useNavigation } from "@react-navigation/native";

const Comment = ({ route }) => {
    const applicationId = route.params?.applicationId; 
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyContext);
    const nav = useNavigation();
    const [content, setContent] = useState("");

    const loadComments = async () => {
        try {
            let res = await authApis(user.access_token).get(endpoints['comments'](applicationId));
            setComments(res.data.results || res.data);
        } catch (ex) {
            console.error("Lỗi load comments:", ex);
        }
    }

    const addComment = async () => {
        if (!content.trim()) return;

        try {
            let res = await authApis(user.access_token).post(endpoints['comments'](applicationId), {
                "content": content
            });
            setComments([res.data, ...comments]);
            setContent(""); 
        } catch (ex) {
            console.error("Lỗi thêm comment:", ex);
            alert("Không thể thêm bình luận!");
        }
    }

    useEffect(() => {
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

export default Comment;