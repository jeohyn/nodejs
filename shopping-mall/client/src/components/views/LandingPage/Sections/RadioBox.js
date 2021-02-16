import React, { useState } from 'react'
import { Radio, Collapse } from 'antd';


const { Panel } = Collapse


function RadioBox(props) {

    const [Value, setValue] = useState(0)
    
    const renderRadioboxLists=()=>(
        props.list&& props.list.map(value=>(
            <Radio key={value._id} value={`${value._id}`}>{value.name}</Radio>
        ))
    )

    const handleRadioChange=(event)=>{
        setValue(event.target.value);
        //부모컴포넌트로 업데이트된 정보 전달
        props.handleFilters(event.target.value)
    }


    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="price" key="1">
                    {/* 여기서 value는 라디오 그룹의 라디오 버튼들 중 선택된 버튼의 value(여기서는 value._id) */}
                    <Radio.Group onChange={handleRadioChange} value={Value}>
                        {renderRadioboxLists()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
