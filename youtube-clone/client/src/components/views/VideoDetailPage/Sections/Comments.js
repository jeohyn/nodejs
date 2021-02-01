import React, { useState } from 'react'
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comments(props) {

    const videoId=props.postId

    //state에서 user정보 가져오기
    const user = useSelector(state => state.user)
    const [CommentValue, setCommentValue] = useState("")

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    //url에서 videoId가져오는 방법
    //const videoId=props.match.params.videoId

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId //부모 컴포넌트(VideoDetailPage.js)에서 props로 videoId 받아오는 방법
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    console.log(response.data.result)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글 등록에 실패하였습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />
            {/* Comment Lists - 댓글(원댓+대댓+대대댓+...)모음 */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.videoId} refreshFunction={props.refreshFunction} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={videoId} commentLists={props.commentLists}/>
                    </React.Fragment>
                )
            ))}

            {/* Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="댓글을 작성해 주세요"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>

        </div>
    )
}

export default Comments