import Home from "./screens/Home/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Application from "./screens/Home/Application";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import Register from "./screens/User/Register";
import Login from "./screens/User/Login";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MyContext } from "./utils/contexts/MyContext";
import { useReducer, useContext } from "react";
import MyUserReducer from "./utils/reducers/MyUserReducer";
import User from "./screens/User/User";
import Apply from "./screens/Home/Apply";
import JobDetail from "./screens/Home/JobDetail";
import AddJob from "./screens/User/AddJob";
import UpdateJob from "./screens/Home/UpdateJob";
import Stats from "./screens/User/Stats";
import HistoryApplication from "./screens/User/HistoryApplication";
import Comment from "./screens/Home/Comment";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
      <Stack.Screen name="HomeScreen" component={Home} options={{ title: "Tuyển dụng"}}  />
      <Stack.Screen name="Application" component={Application} options={{ title: "Danh sách đơn ứng tuyển" }} />
      <Stack.Screen name="JobDetail" component={JobDetail} options={{ title: "Chi tiết tuyển dụng" ,tabBarHideOnKeyboard:false}} />
      <Stack.Screen name="Apply" component={Apply} options={{ title: "Ứng tuyển" }} />
      <Stack.Screen name="Comment" component={Comment} options={{ title: "Chi tiết đơn ứng tuyển" }} />
      <Stack.Screen name="UpdateJob" component={UpdateJob} options={{ title: "Cập nhật đơn tuyển dụng" }} />
      <Stack.Screen name="HistoryApplication" component={HistoryApplication}  options={{ title: "Lịch sử ứng tuyển" }} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const [user,] = useContext(MyContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: true, tabBarHideOnKeyboard: true }}>
      <Tab.Screen name="Home" component={StackNavigator} options={{ title: "Trang chủ", headerShown: false, tabBarIcon: () => <Icon color="blue" source="home" size={30} /> }} />
      {user === null ? <>
        <Tab.Screen name="Register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <Icon color="blue" source="account" size={30} /> }} />
        <Tab.Screen name="Login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon color="blue" source="login" size={30} /> }} />
      </> : <>
        <Tab.Screen name="Profile" component={User} options={{ title: "Profile", tabBarIcon: () => <Icon color="blue" source="account" size={30} /> }} />
      </>}
      {user?.role === "employer" && (<>
        <Tab.Screen name="AddJob" component={AddJob} options={{ title: "Tuyển dụng", tabBarIcon: () => <Icon color="blue" source="file-document" size={30} /> }} />
        <Tab.Screen name="Stats" component={Stats} options={{ title: "Thống kê", tabBarIcon: () => <Icon color="blue" source="chart-bar" size={30} /> }} />
      </>)}
      {user?.role === "candidate" && (<>
        <Tab.Screen name="HistoryApplications" component={StackNavigator} initialParams={{ screen: 'HistoryApplication' }} options={{ title: "Lịch sử ứng tuyển",headerShown: false , tabBarIcon: () => <Icon color="blue" source="file-document" size={30} /> }} />
      </>)}

    </Tab.Navigator>
  )
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </MyContext.Provider>
  );
}

export default App;
