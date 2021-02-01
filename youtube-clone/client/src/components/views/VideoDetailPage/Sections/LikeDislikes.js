import React, {useEffect, useState} from 'react'
import {Tooltip, Icon} from 'antd'
import Axios from 'axios'

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [likeAction, setlikeAction] = useState(null)

    let variable={}
    if(props.video){
        variable={ 
            videoId:props.videoId,
            userId:props.userId
        }
    }else{
        variable={
            commentId:props.commentId,
            userId:props.userId
        }
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
        .then(response=>{
            if(response.data.success){

                //like 수
                setLikes(response.data.likes.length)

                //유저의 like 누름 여부
                response.data.likes.map(like=>{
                    if(like.userId===props.userId){
                        setlikeAction('liked')
                    }
                })
            }else{
                alert('Like 정보를 가져오지 못했습니다.')
            }
        })

        Axios.post('/api/like/getDislikes', variable)
        .then(response=>{
            if(response.data.success){

                //dislike 수
                setDislikes(response.data.dislikes.length)

                //유저의 dislike 누름 여부
                response.data.dislikes.map(dislike=>{
                    if(dislike.userId===props.userId){
                        setlikeAction('disliked')
                    }
                })
            }else{
                alert('DisLike 정보를 가져오지 못했습니다.')
            }
        })

    }, [])

    const onLike=()=>{
        if(likeAction===null || likeAction==='disliked'){
            Axios.post('/api/like/upLike', variable)
            .then(response=>{
                if(response.data.success){
                    if(likeAction==='disliked'){
                        setDislikes(Dislikes--)
                    }
                    setLikes(Likes+1)
                    setlikeAction('liked')
                }else{
                    alert('like하지 못했습니다.')
                }
            })
        }else{
            Axios.post('/api/like/unLike', variable)
            .then(response=>{
                if(response.data.success){
                    setLikes(Likes-1)
                    setlikeAction(null)
                }else{
                    alert('like을 취소하지 못했습니다.')
                }
            })
        }
    }

    const onDislike=()=>{
        if(likeAction===null || likeAction==='liked'){
            Axios.post('/api/like/upDisLike', variable)
            .then(response=>{
                if(response.data.success){
                    if(likeAction=='liked'){
                        setLikes(Likes-1)
                    }
                    setDislikes(Dislikes+1)
                    setlikeAction('disliked')
                }else{
                    alert('dislike하지 못했습니다.')
                }
            })
        }else{
            Axios.post('/api/like/unDislike', variable)
            .then(response=>{
                if(response.data.success){
                    setDislikes(Dislikes-1)
                    setlikeAction(null)
                }else{
                    alert('dislike을 취소하지 못했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={likeAction==='liked'? "filled":"outlined"}
                        onClick={onLike}
                        />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}>{Likes}</span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={likeAction==='disliked'? "filled":"outlined"}
                        onClick={onDislike}
                        />
                </Tooltip>
                <span style={{paddingLeft:'8px', cursor:'auto'}}>{Dislikes}</span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
