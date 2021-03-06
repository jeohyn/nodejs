import React from 'react'
import { Descriptions, Button} from 'antd';
import {useDispatch} from 'react-redux'
import {addToCart} from '../../../../_actions/user_actions'

function ProductInfo(props) {
    const dispatch=useDispatch()

    const clickHandler=()=>{
        //필요한 정보를 db의 user model의 cart field에 저장
        //상품의 아이디, 갯수, 언제 넣었는지에 대한 날짜 정보
        dispatch(addToCart(props.detail._id))
        .then((response, err)=>{
           if(err){
               alert('장바구니에 상품을 추가하지 못했습니다.')
           }
           else{
               alert('장바구니에 상품을 추가했습니다.')
           }
        })
    }

    return (
        <div>
            <Descriptions title="Product Info" bordered>
                <Descriptions.Item label="Price">${props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br/>
            <br/>
            <br/>
            <div style={{display:'flex', justifyContent:'center'}}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    Add to Cart
                </Button>
            </div>

        </div>
    )
}

export default ProductInfo
