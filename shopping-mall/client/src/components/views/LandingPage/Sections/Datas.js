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
        "name":"$1 to $10",
        "array":[0.9, 10.1]
    },
    {
        "_id":3,
        "name":"$10 to $25",
        "array":[9.9, 25.1]
    },
    {
        "_id":4,
        "name":"$25 to $50",
        "array":[24.9, 50.1]
    },
    {
        "_id":5,
        "name":"$50 to $100",
        "array":[49.9, 100.1]
    },
    {
        "_id":6,
        "name":"More than $100",
        "array":[99.9, 100000]
    }
]

export {
    continent,
    price
}