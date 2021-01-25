import React ,{useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import Axios from 'axios'
import {Card, Icon, Avatar, Col, Typography, Row} from 'antd';
import moment from 'moment';

const {Title}=Typography;
const {Meta}=Card;

function SubscriptionPage() {
    const [Video, setVideo] = useState([])

    //DOM이 로드되자마자 무엇을 먼저 실행할 것인지 선언
    useEffect(() => {

        const subscriptionVariable={
            userFrom:localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariable)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            }else{
                alert('비디오를 가져오는 데에 실패했습니다.')
            }
        })
    }, [])

    const renderCards=Video.map((video, index)=>{

        var minutes=Math.floor(video.duration/60);
        var seconds=Math.floor(video.duration-minutes*60);

        /*전체 사이즈가 24. 따라서 md이면 8(md일 때 한 칼럼의 사이즈)*3이니까 칼럼 수가 3개임*/
        return <Col lg={6} md={8} xs={24}> 
            <div style={{position:'relative'}}>
                <a href={`/video/${video._id}`}>
                <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail"/>
                <div className="duration">
                    <span>{minutes} : {seconds}</span>
                </div>
                </a>
            </div>
            <br />
            <Meta
                avatar={
                     <Avatar src={video.writer.image} /> /*avatar는 유저의 이미지 */
                    }
                title={video.title}
                />
                <span>{video.writer.name}</span><br/>
                <span style={{marginLeft:'3rem'}}>{video.views} views</span><br/>
                <span style={{marginLeft:'3rem'}}>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>Recommended</Title>
            <hr/>
            <Row gutter={[32, 16]}>

                {renderCards}

            </Row>
        </div>
    )
}

export default SubscriptionPage
