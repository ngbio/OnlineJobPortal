import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../utils/Apis";
import { ActivityIndicator, List, Searchbar, SegmentedButtons } from "react-native-paper";
import { FlatList, Text, View } from "react-native";
import MyStyles from "../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyContext } from "../utils/contexts/MyContext";


const JobPosts = ({ cate }) => {
    const [job_post, setJobPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [company, setCompany] = useState(""); 
    const [address, setAddress] = useState("");
    const [page, setPage] = useState(1);
    const nav = useNavigation();
    const [user] = useContext(MyContext);
    const [sortBy, setSortBy] = useState("date_desc");





    const loadJobPosts = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['job_posts']}?page=${page}&sort_by=${sortBy}`;

            if (name) {
                url = `${url}&name=${name}`;
            }

            if (company) 
                url += `&company=${company}`; 
            
            if (address) 
                url += `&address=${address}`;
            

            if (cate) {
                url = `${url}&category_id=${cate}`;
            }


            let res;

            if (user && user.role === "employer") {

                res = await authApis(user.access_token).get(url);

            } else {

                res = await Apis.get(url);

            }


            if (res.data.next === null) {
                setPage(0);
            }

            if (page === 1) {
                setJobPost(res.data.results);
            } else if (page > 1) {
                setJobPost([...job_post, ...res.data.results]);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0)
                loadJobPosts();
        }, 500);
        return () => clearTimeout(timer);
    }, [name, company, address, page, cate, sortBy]);

    const handleJobPress = (item) => {

        if (!user) {

            alert("Vui lòng đăng nhập để xem chi tiết và ứng tuyển!");

            nav.navigate("Login");

        } else {

            nav.navigate("JobDetail", { job: item });

        }

    };

    useEffect(() => {
        setPage(1);
    }, [name, cate, sortBy]);

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Searchbar placeholder="Tìm việc làm" value={name} onChangeText={setName} style={{ margin: 10 }} />
            <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                <SegmentedButtons
                    value={sortBy}
                    onValueChange={setSortBy}
                    buttons={[
                        { value: 'date_desc', label: 'Mới nhất', icon: 'clock' },
                        { value: 'salary_desc', label: 'Lương cao', icon: 'trending-up' },
                    ]}
                />
            </View>
            <FlatList style={MyStyles.padding} ListFooterComponent={loading && <ActivityIndicator size="large" />}
                onEndReached={loadMore} data={job_post} onEndReachedThreshold={0.5} renderItem={({ item }) => <List.Item
                    title={item.name}
                    description={() => (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={{ color: '#1976D2', fontWeight: '600', marginBottom: 5 }}>
                             {item.company}
                        </Text>
                        
                        <View style={MyStyles.chip}>
                            <Text>{item.salary} triệu</Text>
                        </View>

                        <View style={MyStyles.chip}>
                            <Text>{item.address}</Text>
                        </View>

                        <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'gray' }}>
                                 Đăng ngày: {new Date(item.created_date).toLocaleDateString('vi-VN')}
                            </Text>
                        </View>
                    </View>
                    
                        
                        
                    )}
                    left={() => <TouchableOpacity onPress={() => handleJobPress(item)}>
                        <View style={MyStyles.circleIcon}>
                            <List.Icon icon="briefcase" color="white" size={100} />
                        </View>
                    </TouchableOpacity>} />} />

        </View>
    );
}

export default JobPosts;