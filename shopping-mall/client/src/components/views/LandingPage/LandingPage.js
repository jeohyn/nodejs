import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import Meta from 'antd/lib/card/Meta'
import {Icon, Col, Card, Row} from 'antd';


function LandingPage() {

    const [Products, setProducts] = useState([])

    useEffect(() => {
        Axios.post('/api/product/products')
        .then(response=>{
            if(response.data.success){
                setProducts(response.data.productInfo)
            }else{
                alert('상품 리스트를 불러오는 데에 실패했습니다.')
            }
        })
    }, [])


    const renderCards=Products.map((product, index)=>{
        console.log('product', product)
        return <Col lg={6} md={8} xs={24} key={index}>
        <Card
            cover={<img style={{width='100%', maxHeight:'150px'}} src={`http://localhost:5000/${product.images[0]}`} />}
            >
            <Meta title={product.title}
            description={`$${product.price}`}/>
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

                <div style={{justifyContent:'center'}}>
                    <button>더보기</button>
                </div>

            </div>
    )
}

export default LandingPage
