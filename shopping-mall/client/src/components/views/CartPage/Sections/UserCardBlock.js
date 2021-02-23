import React from 'react'
import "./UserCardBlock.css"
import {Button} from 'antd'

function UserCardBlock(props) {

    const renderCardImage=(images)=>{
        if(images.length>0){
            let image=images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems=()=>(
        props.products && props.products.map((product, index)=>(
            <tr key={index}>
                <td>
                    <img style={{width:'70px'}} alt="product"
                        src={renderCardImage(product.images)}/>
                </td>
                <td>
                    {product.title}
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    {product.price} KRW
                </td>
                <td>
                    <Button>Remove</Button>
                </td> 
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Porduct Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>

                <tbody>
                    {renderItems()}
                </tbody>

            </table>
        </div>
    )
}

export default UserCardBlock
