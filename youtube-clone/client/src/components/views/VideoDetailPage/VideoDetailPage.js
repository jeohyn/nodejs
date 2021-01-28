import React, {useEffect, useState} from 'react'
import {Row, Col, List, Avatar} from 'antd'
import Axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'

function VideoDetailPage(props) {

    //App.js에서 라우팅을 /video/:videoId 로 해서 props.match.params.videoId로 videoId 가져올 수 있음
    const videoId=props.match.params.videoId
    const variable={videoId:videoId}

    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response=>{
            if(response.data.success){
                setVideoDetail(response.data.videoDetail)
            }else{
                alert('비디오 정보를 가져오는 것을 실패했습니다.')
            }
        })
    }, [])
    if(VideoDetail.writer){
        
        //만약 글 작성자==접속자이면 구독 버튼 안보이게 하기
        const subscribeButton = VideoDetail.writer._id!==localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
    
                    <div style={{width:'100%', padding:'3rem 4rem'}}>
                        <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
    
                        <List.Item
                            actions={[subscribeButton]}>
    
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image}/>}
                                    title={VideoDetail.writer.name}
                                    description={VideoDetail.description}
                                    />
    
                            </List.Item>
                            {/* Comments */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                   <SideVideo/>
                </Col>
            </Row>
        )
    } else{
        return(
            <div>...loading</div>
        )
    }
   
}

export default VideoDetailPage
