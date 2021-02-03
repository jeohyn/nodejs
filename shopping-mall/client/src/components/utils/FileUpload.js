import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd'
import Axios from 'axios'

function FileUpload() {

    const [Images, setImages] = useState([])

    const dropHandler=(files)=>{
        //file에 대한 정보
        let formData=new FormData();
        //header에 파일 정보 정의->backend에서 req받을 때 error 발생x
        const config={
            header:{'content-type':'multipart/form-data'}
        }
        formData.append("file", files[0])
        Axios.post('/api/product/image', formData, config)
        .then(response=>{
            if(response.data.success){
                //...Images : 원래 저장되어있던 이미지들
                setImages([...Images, response.data.filePath])
            }else{
                alert("이미지 업로드에 실패했습니다.")
            }
        })
    }

    const deleteHandler=(image)=>{
        const currentIndex=Images.indexOf(image);
        let newImages=[...Images]
        //currentIndex에서부터 한 원소 삭제
        newImages.splice(currentIndex, 1)
        setImages(newImages)
    }

    return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <section>
                    <div
                        style={{
                            width:300, height:240, border:'1px solid lightgray',
                            display:'flex', alignItems:'center', justifyContent:'center'
                        }} 
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{fontSize:'3rem'}}/>
                    </div>
                    </section>
                )}
            </Dropzone>

            <div style={{display:'flex', width:'350px', height:'240px', overflowX:'scroll'}}>
                {Images.map((image, index)=>(
                    <div onClick={()=>deleteHandler(image)} key={index}>
                        <img style={{minWidth:'300px', width:'300px', height:'240px'}}
                            src={`http://localhost:5000/${image}`}
                            />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default FileUpload
