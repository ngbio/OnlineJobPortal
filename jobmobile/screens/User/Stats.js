import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { List, Card, ProgressBar, Surface, Divider } from 'react-native-paper';
import { MyContext } from '../../utils/contexts/MyContext';
import { authApis, endpoints } from '../../utils/Apis';
import MyStyles from '../../styles/MyStyles';

const Stats = () => {
    const [user] = useContext(MyContext);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            const res = await authApis(user.access_token).get(endpoints['stats']);
            setStats(res.data);
        } catch (ex) {
            console.error("Lỗi tải thống kê:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading)   
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#6200ee" />;

    const maxApplications = stats.length > 0 ? Math.max(...stats.map(s => s.total_applications)) : 1;

    return (
        <ScrollView style={styles.container}>
            <Surface style={styles.header} elevation={2}>
                <Text style={styles.headerText}>THỐNG KÊ TUYỂN DỤNG</Text>
            </Surface>

            {stats.length > 0 ? (
                <View style={{ padding: 10 }}>
                    <Card style={styles.summaryCard}>
                        <Card.Content>
                            <Text style={styles.summaryTitle}>Tổng quan bài đăng</Text>
                            <Divider style={{ marginVertical: 10 }} />
                            
                            {stats.map((s) => {
                                const progress = s.total_applications / (maxApplications || 1);
                                
                                return (
                                    <View key={s.id} style={styles.statRow}>
                                        <View style={styles.labelRow}>
                                            <Text style={styles.jobName} numberOfLines={1}>{s.name}</Text>
                                            <Text style={styles.jobCount}>{s.total_applications} hồ sơ</Text>
                                        </View>
                                    
                                        <ProgressBar 
                                            progress={progress} 
                                            color={progress === 1 ? "#4CAF50" : "#6200ee"} 
                                            style={styles.progressBar} 
                                        />
                                    </View>
                                );
                            })}
                        </Card.Content>
                    </Card>

                    <Text style={styles.sectionTitle}>Danh sách chi tiết</Text>
                    {stats.map((s) => (
                        <Card key={s.id} style={styles.listItemCard}>
                            <List.Item
                                title={s.name}
                                titleStyle={{fontWeight: 'bold'}}
                                description={`ID bài đăng: #${s.id}`}
                                left={props => <List.Icon {...props} icon="briefcase-check" color="#6200ee" />}
                                right={() => (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{s.total_applications}</Text>
                                    </View>
                                )}
                            />
                        </Card>
                    ))}
                </View>
            ) : (
                <View style={styles.empty}>
                    <Text>Chưa có dữ liệu thống kê.</Text>
                </View>
            )}
            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { padding: 25, backgroundColor: '#6200ee', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerText: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    summaryCard: { marginVertical: 15, borderRadius: 15, backgroundColor: 'white' },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statRow: { marginBottom: 18 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    jobName: { flex: 1, fontSize: 14, color: '#555' },
    jobCount: { fontWeight: 'bold', color: '#6200ee' },
    progressBar: { height: 8, borderRadius: 5 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: '#333' },
    listItemCard: { marginBottom: 10, borderRadius: 10 },
    badge: { 
        backgroundColor: '#eee1ff', 
        paddingHorizontal: 12, 
        paddingVertical: 4, 
        borderRadius: 20, 
        justifyContent: 'center', 
        alignSelf: 'center' 
    },
    badgeText: { color: '#6200ee', fontWeight: 'bold' },
    empty: { alignItems: 'center', marginTop: 50 }
});

export default Stats;