import React from 'react';

export class Feedback extends React.Component {
    render() {
        return (<div>
            <div style={{display: 'flex', width: 51.75, height: 37}}>
                <div style={{width: 6.75}}>
                    <div style={{height: 6.75, borderRight: '10px solid rgb(66, 154, 221)', borderBottom: '10px solid transparent'}}></div>
                    <div></div>
                </div>
                <div style={{backgroundColor: 'rgb(66, 154, 221)', width: 45, borderTopRightRadius: 6.75, borderBottomRightRadius: 6.75, borderBottomLeftRadius: 6.75}}>
                    <div style={{height: 12}}></div>
                    <div style={{height: 4, display: 'flex'}}>
                        <div style={{width: 12}}></div>
                        <div style={{width: 4.5, borderRadius: 4.5, backgroundColor: 'white'}}></div>
                        <div style={{width: 12}}></div>
                        <div style={{width: 4.5, borderRadius: 4.5, backgroundColor: 'white'}}></div>
                        <div style={{width: 12}}></div>
                    </div>
                    <div style={{height: 6}}></div>
                    <div style={{height: 6, display: 'flex'}}>
                        <div style={{width: 15}}></div>
                        <div style={{width: 15, backgroundColor: 'white', borderBottomLeftRadius: 100, borderBottomRightRadius: 100}}></div>
                        <div style={{width: 15}}></div>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default Feedback;
