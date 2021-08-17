import React, {ReactElement} from "react";
import './spinner.css'

export default function Spinner(props: any): ReactElement {
    return (
        <div className={'circle2-spinner'}>
            <div id="circle2" style={{
                height: props.height,
                width: props.width,
            }}/>
        </div>
    )
}