const continent=[
    {
        "_id":1,
        "name":"Africa"
    },
    {
        "_id":2,
        "name":"Europe"
    },
    {
        "_id":3,
        "name":"Asia"
    },
    {
        "_id":4,
        "name":"North America"
    },
    {
        "_id":5,
        "name":"South America"
    },
    {
        "_id":6,
        "name":"Australia"
    },
    {
        "_id":7,
        "name":"Antarctica"
    },
]

const price=[
    {
        "_id":0,
        "name":"Any",
        "array":[]
    },
    {
        "_id":1,
        "name":"Free",
        "array":[-1, 0]
    },
    {
        "_id":2,
        "name":"1000KRW to 10,000KRW",
        "array":[1000, 10000]
    },
    {
        "_id":3,
        "name":"10,000KRW to 25,000KRW",
        "array":[10000, 25000]
    },
    {
        "_id":4,
        "name":"25,000KRW to 50,000KRW",
        "array":[25000, 50000]
    },
    {
        "_id":5,
        "name":"50,000KRW to 100,000KRW",
        "array":[50000, 100000]
    },
    {
        "_id":6,
        "name":"More than 100,000KRW",
        "array":[100000, 100000000]
    }
]

export {
    continent,
    price
}