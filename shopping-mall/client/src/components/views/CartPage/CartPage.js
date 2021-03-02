import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {getCartItems, removeCartItem} from '../../../_actions/user_actions'
import UserCardBlock from './Sections/UserCardBlock'
import {Empty} from 'antd'
import Paypal from '../../utils/Paypal'

function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)

    useEffect(() => {

        let cartItems = [];
        //리덕스 user state의 cart안에 상품이 존재하는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then((response) => {
                        if (response.payload.length > 0) {
                            calculateTotal(response.payload)
                        }
                    })
            }
        }

    }, [props.user.userData])

    const calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        });

        setTotal(total)
        setShowTotal(true)
    }


    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then(response => {
                if (response.payload.cartDetail==undefined || response.payload.cartDetail.length<=0) {
                    setShowTotal(false)
                } else {
                    calculateTotal(response.payload.cartDetail)
                }
            })
    }


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            {ShowTotal ?
                <div>
                    <UserCardBlock
                    products={props.user.cartDetail}
                    removeItem={removeFromCart}/>
                    <h2>Total amount: ${Total}</h2>
                </div>
                    :
                    <Empty description={false}/>
                }
                
            {/* Paypal Button */}
            {ShowTotal &&
                <Paypal price={Total}/>
            }
        </div>
    )
}
export default CartPage