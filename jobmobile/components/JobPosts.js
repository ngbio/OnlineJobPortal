import { useContext, useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../utils/Apis";
import { ActivityIndicator, Chip, List, Searchbar } from "react-native-paper";
import { FlatList, View } from "react-native";
import MyStyles from "../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyContext } from "../utils/contexts/MyContext";


const JobPosts = ({ cate }) => {
    const [job_post, setJobPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [page, setPage] = useState(1);
    const nav = useNavigation();
    const [user] = useContext(MyContext);




    const loadJobPosts = async () => {
        try {
            setLoading(true);

            let url = `${endpoints['job_posts']}?page=${page}`;

            if (name) {
                url = `${url}&name=${name}`;
            }

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
    }, [name, page, cate]);

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
    }, [name, cate]);

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }

    return (
        <View style={[MyStyles.padding]}>
            <Searchbar placeholder="Tìm việc làm" value={name} onChangeText={setName} style={{ margin: 10 }} />
            <FlatList style={MyStyles.padding} ListFooterComponent={loading && <ActivityIndicator size="large" />}
                onEndReached={loadMore} data={job_post} onEndReachedThreshold={0.5} renderItem={({ item }) => <List.Item
                    title={item.name}
                    description={item.description}
                    left={() => <TouchableOpacity onPress={() => handleJobPress(item)}>
                        <View style={MyStyles.circleIcon}>
                            <List.Icon icon="briefcase" color="white" size={100} />
                        </View>
                    </TouchableOpacity>} />} />

        </View>
    );
}

export default JobPosts;