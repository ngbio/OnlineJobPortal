import { useEffect, useState, useContext } from "react";
import { FlatList, Image } from "react-native";
import { ActivityIndicator, List } from "react-native-paper";
import { authApis, endpoints } from "../../utils/Apis";
import { MyContext } from "../../utils/contexts/MyContext";
import MyStyles from "../../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

const Application = ({route}) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyContext);    
    const nav = useNavigation();
    const jobId = route.params?.jobId;

    const loadApplications = async () => {
        try {
            console.log("Context User:", user);
            setLoading(true);

            const res = await authApis(user.access_token).get(endpoints['applications']);
            setApplications( res.data);

        } catch (ex) {
            console.error("LOAD APPLICATION ERROR:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
        if (user === null) {
            nav.navigate("HomeScreen"); // Hoặc nav.popToTop();
    }
    }, [user]);

    if (loading)
        return <ActivityIndicator style={{ marginTop: 20 }} />;

    return (
        <View>
            {user.role == "employer" &&(
                <FlatList
                            data={applications}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (<List.Item
                                        title={item.full_name}
                                        description={`Ngày ứng tuyển: ${new Date(item.created_date).toLocaleDateString()}`}
                                        left={() => 
                                        <TouchableOpacity onPress={() => nav.navigate("ApplicationDetail", { "applicationId": item.id })}>
                                            <View style={MyStyles.circleIcon}>
                                                <List.Icon icon="account" color="white" size={100} />
                                            </View>
                                        </TouchableOpacity>}
                                    />
                            )}
                        />
            )}
            {user.role == "candidate" && (
                <FlatList
                            data={applications}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (<List.Item
                                        title={item.full_name}
                                        description={`Ngày ứng tuyển: ${new Date(item.created_date).toLocaleDateString()}`}
                                        left={() => <View style={MyStyles.circleIcon}>
                                                        <List.Icon icon="account" color="white" size={100} />
                                                    </View>}
                                    />
                            )}
                        />
            )}

        </View>
    );
};

export default Application;
