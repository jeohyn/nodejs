import React, {useState} from 'react'
import {Comment, Avatar, Button, Input} from 'antd';
import { useSelector } from 'react-redux';
import Axios from 'axios'

function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false)

    const onClickReplyOpen=()=>{
        setOpenReply(!OpenReply)
    }

    const actions=[
        <span onClick={onClickReplyOpen} key="comment-reply-to">Reply</span>
    ]

    const [CommentValue, setCommentValue] = useState("")
    const onHandleChange=(event)=>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit=(event)=>{
        event.preventDefault();

        const variables = {
            writer: user.userData._id,
            postId: props.postId,//부모 컴포넌트(VideoDetailPage.js)에서 props로 videoId 받아오는 방법
            responseTo: props.comment._id,
            content: CommentValue
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글 등록에 실패하였습니다.')
                }
            })
     }

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt/>}
                content={<p>{props.comment.content}</p>}/>
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <textArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="답글을 작성해 보세요"
                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
