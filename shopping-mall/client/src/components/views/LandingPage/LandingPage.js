import React, {useEffect, useState} from 'react'
import Axios from 'axios'
import Meta from 'antd/lib/card/Meta'
import {Icon, Col, Card, Row, Button, Collapse} from 'antd';
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import {continent, price} from './Sections/Datas'
import SearchFeature from './Sections/SearchFeature'

function LandingPage() {

    const [Products, setProducts] = useState([])
    //더보기 클릭시 첫 데이터에서부터 얼마만큼 스킵해서 다음 데이터들을 가져와야하는지에 대한 스킵 정보
    const [SKIP, setSKIP] = useState(0)
    //한번에 디비에서 랜딩페이지로 불러올 product갯수
    const [LIMIT, setLIMIT] = useState(8)
    //더보기버튼 없애거나 생기게하기위해 저장하는 product 갯수
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continent:[],
        price:[]
    })

    const [SearchTerm, setSearchTerm] = useState("")

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

    const handlePrice=(filterValue)=>{
        const data=price;
        let array=[];
        for(let key in data){
            if(data[key]._id===parseInt(filterValue, 10)){
                array=data[key].array;
            }
        }
        return array;
    }

    //filters:checked continent 또는 selected price 의 id가 저장되어있음
    //category:검색할 때의 기준. continent냐 price냐를 저장
    const handleFilters=(filters, category)=>{
        const newFilters={...Filters}
        newFilters[category]=filters
        
        if(category==="price"){
            let priceValues=handlePrice(filters)
            newFilters[category]=priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const showFilteredResults=(filters)=>{
        let body={
            skip:0,
            limit:LIMIT,
            filters:filters
        }
        getProducts(body)
        setSKIP(0)
    }

    const updateSearchTerm=(newSearchTerm)=>{
        
        let body={
            skip:0,
            limit:LIMIT,
            filters:Filters,
            searchTerm:newSearchTerm
        }

        setSKIP(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
            <div style={{width:'75%', margin:'3rem auto'}}>

                <div style={{textAlign:'center'}}>
                    <h2>Let's Travel Anywhere<Icon type='rocket'/></h2> 
                </div>

                {/* filter */}
                <Row gutter={[16, 16]}>
                    <Col lg={12} xs={24}>
                    {/* checkbox */}
                    <CheckBox list={continent} handleFilters={filters=>handleFilters(filters, "continent")}/>
                    </Col>
                    <Col lg={12} xs={24}>
                    {/* radiobox */}
                    <RadioBox
                        list={price}
                        handleFilters={filters => handleFilters(filters, "price")}
                    />
                </Col>
                </Row>
                    {/* search */}
                    <div style={{display:'flex', justifyContent:'flex-end', margin:'1rem auto'}}>
                        <SearchFeature 
                            refreshFunction={updateSearchTerm}/>
                    </div>
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
