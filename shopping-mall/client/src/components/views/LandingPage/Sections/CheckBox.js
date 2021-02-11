import React, { useState } from 'react'
import { Checkbox, Collapse } from 'antd';

const { Panel } = Collapse


function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {
        //누른 continent의 state안에서의 index 구함
        const currentIndex = Checked.indexOf(value);
        const newChecked = [...Checked];

        //Checked state에 있는걸(currentIndex!=-1) 또 눌렀다면 state에서 삭제
        if (currentIndex !== -1) {
            newChecked.splice(currentIndex, 1)
        } else {//그게 아니면(currentIndex=-1이라면) state에 추가
            newChecked.push(value)
        }

        setChecked(newChecked)
        
        //부모컴포넌트로 업데이트된 정보 전달
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => props.list && props.list.map((continent, index) => (
        <React.Fragment key={index}>
            <Checkbox
                onChange={() => handleToggle(continent._id)}
                type="checkbox"
                checked={Checked.indexOf(continent._id) === -1 ? false : true}
            />&nbsp;&nbsp;
            <span>{continent.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Continents" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox