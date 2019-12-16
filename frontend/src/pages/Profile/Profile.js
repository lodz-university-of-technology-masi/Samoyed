import React from "react";
import { useSelector } from 'react-redux'

export default function Profile() {

    const state = useSelector(state => state)

    const roleName = (state.data["cognito:groups"].includes("recruiters")) ? "Rekruter" : "Kandydat"

	return (<>
        <div className="row">
                <h1 className="d-inline-block">
                    { state.data.given_name + " " + state.data.family_name }
                    <span class="badge badge-dark align-middle ml-2" style={{fontSize: 16}}>{ roleName }</span>
                </h1>
        </div>
        <pre>
            { JSON.stringify(state, null, "    ") }
        </pre>
    </>)
    
}
