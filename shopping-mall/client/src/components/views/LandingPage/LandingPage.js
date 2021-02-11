import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import Meta from 'antd/lib/card/Meta'
import {Icon, Col, Card, Row, Button} from 'antd';
import ImageSlider from '../../utils/ImageSlider'

function LandingPage() {

    const [Products, setProducts] = useState([])
    //더보기 클릭시 첫 데이터에서부터 얼마만큼 스킵해서 다음 데이터들을 가져와야하는지에 대한 스킵 정보
    const [SKIP, setSKIP] = useState(0)
    //한번에 디비에서 랜딩페이지로 불러올 product갯수
    const [LIMIT, setLIMIT] = useState(8)
    //더보기버튼 없애거나 생기게하기위해 저장하는 product 갯수
    const [PostSize, setPostSize] = useState(0)

    const getProducts=(body)=>{
        Axios.post('/api/product/products', body)
        .then(response=>{
            if(response.data.success){
                if(body.loadMore){
                    setProducts([...Products, ...response.data.productInfo])
                }else{
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize)
            }else{
                alert('상품 리스트를 불러오는 데에 실패했습니다.')
            }
        })
    }

    useEffect(() => {
        let body={
            skip:SKIP,
            limit:LIMIT
        }
        getProducts(body)
    }, [])

    const loadMoreHandler=()=>{
        let skip=SKIP+LIMIT;
        let body={
            skip:skip,
            limit:LIMIT,
            loadMore:true//더보기btn을 눌러서 로딩한다는 것 표시
        }
        getProducts(body)
        setSKIP(SKIP)
    }

    const renderCards=Products.map((product, index)=>{
        console.log('product', product)
        return <Col lg={6} md={8} xs={24} key={index}>
        <Card
            cover={<ImageSlider images={product.images}/>}
            >
            <Meta title={product.title}
            description={`${product.price}KRW`}/>
        </Card>
        </Col>
    })

    return (
            <div style={{width:'75%', margin:'3rem auto'}}>

                <div style={{textAlign:'center'}}>
                    <h2>Let's Travel Anywhere<Icon type='rocket'/></h2> 
                </div>

                {/* filter */}

                {/* search */}

                {/* cards */}

                <Row gutter={[16, 16]}>
                {renderCards}
                </Row>

                {PostSize>=LIMIT &&
                    <div style={{justifyContent:'center'}}>
                        <Button onClick={loadMoreHandler}>더보기</Button>
                    </div>
                }
            </div>
    )
}

export default LandingPage
