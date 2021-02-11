import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd'
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios'

const {Title}=Typography;
const {TextArea}=Input;
const Continent=[
    {key:1, value:"Africa"},
    {key:2, value:"Europe"},
    {key:3, value:"Asia"},
    {key:4, value:"North America"},
    {key:5, value:"South America"},
    {key:6, value:"Australia"},
    {key:7, value:"Antarctica"}
]

function UploadProductPage(props) {

    const [title, settitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continents, setContinents] = useState(1)
    const [Image, setImage] = useState([])

    const titleChangeHandler=(event)=>{
        settitle(event.currentTarget.value)
    }

    const descriptionChangeHandler=(event)=>{
        setDescription(event.currentTarget.value)
    }
    
    const priceChangeHandler=(event)=>{
        setPrice(event.currentTarget.value)
    }

    const continentsChangeHandler=(event)=>{
        setContinents(event.currentTarget.value)
    }

    const updateImages=(newImage)=>{
        setImage(newImage)
    }

    const onSubmit=(event)=>{
        event.preventDefault();
        if(!title || !Description || !Price || !Continents || !Image){
            return alert("모든 칸을 채워주세요")
        }

        const body={
            //auth.js의 <SpecificComponent>의 prop에서 user 정보 가져옴
            writer:props.user.userData._id,
            title:title,
            description:Description,
            price:Price,
            continent:Continents,
            images:Image
        }

        //서버에 값들을 request로 보냄
        Axios.post("/api/product/uploadProduct", body)
        .then(response=>{
            if(response.data.success){
                alert("상품 업로드를 완료했습니다.")
                //랜딩페이지로 이동
                props.history.push('/')
            }
            else{
                alert("상품 업로드에 실패했습니다.")
            }
        })
    }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{textAlign:'center', marginBottom:'2rem'}}>
                <Title level={2}>여행 상품 업로드</Title>
            </div>

            <Form onSubmit={onSubmit}>
                {/* dropzone */}
                <FileUpload refreshFunction={updateImages}/>

                <br/>
                <br/>
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={title}/>
                <br/>
                <br/>
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description}/>
                <br/>
                <br/>
                <label>가격(원)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price}/>
                <br/>
                <br/>
                <select onChange={continentsChangeHandler} value={Continents}>
                    {Continent.map((item=>(
                        <option key={item.key} value={item.key}>{item.value}</option>
                    )))}
                </select>
                <br/>
                <br/>
                <Button onClick={onSubmit}>
                    확인
                </Button>
            </Form>
        </div>
    )
}

export default UploadProductPage
