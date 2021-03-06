import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import ProductImage from "./Sections/ProductImage"
import ProductInfo from "./Sections/ProductInfo"
import {Row, Col} from 'antd'

function DetailProductPage(props) {
    //url에서 productId 가져오기
    const productId=props.match.params.productId
    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response=>{
            setProduct(response.data[0])
        })
        .catch(err=>alert('상세 페이지 로딩에 실패했습니다.', err))
    }, [])

    const [Product, setProduct] = useState({})

    return (
        <div style={{width:'100%', padding:'3rem 4rem'}}>
            <div style={{display:'flex', justifyContent:'center'}}>
                <h1>{Product.title}</h1>
            </div>
            <br/>
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* product image */}
                    <ProductImage detail={Product}/>
                </Col>

                <Col lg={12} xs={24}>
                    {/* product info */}
                    <ProductInfo detail={Product}/>
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage
