import React, {useEffect, useState} from "react";
import {TableFilterRow} from "@devexpress/dx-react-grid-material-ui";

export const DxCustomFilter = React.memo(({onChange, value: valueProp, ...restProps}: any) => {
    const {filtersNeedReset, setFiltersNeedReset} = restProps

    //удалить доп параметры чтоб ошибок не было
    const props = restProps
    delete props.filtersNeedReset
    delete props.setFiltersNeedReset

    const [value, setValue] = useState(valueProp);
    const onKeyUp = (e: any) => {
        onChange(value);
    };

    useEffect(() => {
        if (filtersNeedReset) {
            setValue('')
            onChange('');
            setFiltersNeedReset(false)
        }
    }, [filtersNeedReset])

    return (
        <TableFilterRow.Editor
            {...props}
            value={value}
            onChange={setValue}
            onKeyUp={onKeyUp}
        />
    );
})
