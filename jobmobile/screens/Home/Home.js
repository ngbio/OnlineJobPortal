import { useState } from "react";
import JobPosts from "../../components/JobPosts"
import Categories from "../../components/Categories";

const Home = () => {
     const [cate, setCate] = useState();
    return (
        <>
            <Categories setCate={setCate} />
            <JobPosts cate={cate}/>
        </>
    );
}

export default Home;