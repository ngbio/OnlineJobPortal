// ApplicationDetail.js
import React, { useEffect, useState, useContext } from "react";
import { View, ScrollView, Text } from "react-native";
import { authApis, endpoints } from "../../utils/Apis";
import { MyContext } from "../../utils/contexts/MyContext";
import { List, Divider, ActivityIndicator } from "react-native-paper";

const ApplicationDetail = ({ route }) => {
    const { applicationId } = route.params; // Nhận ID từ HistoryApplication
    const [user] = useContext(MyContext);
    const [application, setApplication] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const api = authApis(user.access_token);
            
            const resApp = await api.get(`${endpoints['applications']}${applicationId}/`);
            setApplication(resApp.data);

            const resComments = await api.get(endpoints['comments'](applicationId));
            setComments(resComments.data.results || resComments.data);
            
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [applicationId]);

    if (loading) return <ActivityIndicator style={{marginTop: 50}} />;

    return (
        <ScrollView style={{ padding: 10 }}>
            {/* Thông tin đơn ứng tuyển */}
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin đơn ứng tuyển</Text>
            {application && (
                <View style={{ marginVertical: 10 }}>
                    <Text>Họ tên: {application.full_name}</Text>
                    <Text>Công việc: {application.job_post?.name}</Text>
                    <Divider style={{ marginVertical: 10 }} />
                </View>
            )}

            {/* Danh sách bình luận/phản hồi */}
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Phản hồi từ nhà tuyển dụng</Text>
            {comments.map(c => (
                <List.Item
                    key={c.id}
                    title={c.user?.first_name || c.user?.username}
                    description={c.content}
                    left={props => <List.Icon {...props} icon="comment-text-outline" />}
                />
            ))}
        </ScrollView>
    );
};

export default ApplicationDetail;
