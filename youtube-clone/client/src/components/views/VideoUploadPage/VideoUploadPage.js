import React, {useState} from 'react';
import {Typography, Button, Form, message, Input, Icon, Descriptions} from 'antd';
import Dropzone from 'react-dropzone'
import Axios from 'axios';
import {useSelector} from 'react-redux';//state에서 정보 가져올 때 사용

const {TextArea}=Input;
const {Title}=Typography;

const PrivateOptions=[
    {value:0, label:"Private"},
    {value:1, label:"Public"}
]

const CategoryOptions=[
    {value:0, label:"Film & Animation"},
    {value:1, label:"Autos & Vehicles"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"},
    {value:4, label:"IT"}
]


function VideoUploadPage(props){

    const user=useSelector(state=>state.user); //state정보 중 user의 state을 저장
    const [VideoTitle, setVideoTitle] = useState("")
    const [VideoDescription, setVideoDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange=(event)=>{
        setVideoTitle(event.currentTarget.value)
    }
    
    const onDescriptionChange=(event)=>{
        setVideoDescription(event.currentTarget.value)
    }

    const onPrivateChange=(event)=>{
        setPrivate(event.currentTarget.value)
    }

    const onCategoryChange=(event)=>{
        setCategory(event.currentTarget.value)
    }

    const onDrop=(files)=>{
        let formData=new FormData();
        const config={
            header:{'content-type':'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response=>{
            if(response.data.success){
                console.log(response.data)

                let variable={
                    url:response.data.url,
                    filename:response.data.filename
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable)
                .then(response=>{
                    if(response.data.success){
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                    }else{
                        alert('썸네일 생성에 실패했습니다.')
                    }
                })
            }
            else{
                alert("영상 업로드를 실패했습니다.")
            }
        })
    }

    const onSubmit=(event)=>{
        event.preventDefault();//새로고침x

        let variables={
            writer: user.userData._id,
            title: VideoTitle,
            description: VideoDescription,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        Axios.post('/api/video/uploadVideo', variables)
        .then(response=>{
            if(response.data.success){
                message.success('성공적으로 업로드 했습니다.')
                setTimeout(()=>{
                    props.history.push('/')
                }, 3000)
                
            }else{
                alert('비디오 업로드에 실패했습니다.')
            }
        })
    }

    return(
        <div sytle={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    {/*Video Drop Zone */}
                    <Dropzone 
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000000}
                        >
                            {({getRootProps, getInputProps})=>(
                            <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display:'flex', alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                                <input {...getInputProps()}/>
                                <Icon type="plus" style={{fontSize:'3rem'}}/>
                                </div>
                                )
                            }
                        </Dropzone>

                    {/*Thumbnail Zone */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}/>
                
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={VideoDescription}/>
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type='primary' size='large' onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage