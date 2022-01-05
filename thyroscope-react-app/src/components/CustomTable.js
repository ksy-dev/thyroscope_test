import React from 'react';
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { Button } from 'reactstrap';

const EditableCell = ({
    value: initialValue,
    row: { index, values },
    column: { id },
    updateMyData,
}) => {

    const [value, setValue] = React.useState(initialValue)
    const [err, setErr] = React.useState(false);

    const onChange = e => {
        let isErr = false;

        switch (e.target.name) {
            case 'email':
                if (!e.target.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    isErr = true;
                }
                break;
            default:
                if (!e.target.value.match(/^[가-힣a-zA-Z\s\d]{3,15}$/)) {
                    isErr = true;
                }
        }

        updateMyData(index, 'isError', isErr);

        setErr(isErr);
        setValue(e.target.value)
    }

    const onBlur = () => {
        updateMyData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        values.isChecked ?
            (
                id !== 'gender' ?
                    <input name={id} style={{ border: err ? '2px solid red' : '1px solid gray' }} value={value} onChange={onChange} onBlur={onBlur} /> :
                    <select style={{ height: 30, width: 90 }} name={values.name} defaultValue={values.gender}>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>
            ) :
            value
    )
}

const defaultColumn = {
    Cell: EditableCell,
}

function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    //const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <div>

            <input

                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={'search by username'}
                style={{
                    border: '1px solid gray',
                    padding: 5,
                    paddingRight: 50,
                    marginTop: 15,
                    marginBottom: 15,
                    fontSize: '0.9rem',
                }}
            />
        </div>
    )
}

function CustomTable({ columns, data, originalData, inputData, onUpdateData, onUpdateOriData }) {

    const handleRemove = (rows) => {
        const newArr = [...data];
        newArr.splice(rows.index, 1);
        // console.log('new arr', newArr);
        onUpdateData(newArr);
    }

    const handleChecked = (item, index, e) => {
        // console.log(item, index, e);
        let newArr = [...data];
        if (!e.target.checked) {
            let oriData = originalData[index];
            newArr[index] = oriData;
        }
        else {
            newArr[index] = { ...item, isChecked: e.target.checked };
        }
        // console.log('check ', newArr)
        onUpdateData(newArr);
    }

    const handleUpdate = (item) => {
        const exists = data.find(p => p.email === inputData.email);
        if (exists) {
            return alert('이미 등록된 이메일이 존재합니다.');
        }

        let index = data.findIndex((element) => element.email === item.email);
        let newArr = [...data];
        newArr[index] = { ...item, isChecked: false, isErr: false };

        onUpdateData(newArr);
        onUpdateOriData(newArr);
    }

    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        onUpdateData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    }
                }
                return row
            })
        )
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state,
        state: { pageIndex, pageSize, globalFilter },
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            initialState: { pageIndex: 0, pageSize: 5, hiddenColumns: ["isChecked", "isError"] },
            updateMyData
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    )
    return (
        <div>
            <div style={{ color: 'gray' }}>
                {rows.length} users
            </div>
            <table {...getTableProps()} >
                <thead>
                    <tr>
                        <th
                            colSpan={visibleColumns.length}
                            style={{
                                textAlign: 'left',
                                padding: '10',
                                border: '3'
                            }}
                        >
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                            />
                        </th>
                    </tr>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            <th />
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' ↓'
                                                : ' ↑'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    <td>
                                        <span>
                                            <input type="checkbox" checked={row.values.isChecked} onChange={e => handleChecked(row.values, row.index, e)} />
                                        </span>
                                    </td>
                                }
                                {row.cells.map(cell => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            style={{
                                                padding: '10px',
                                            }}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                                {
                                    row.values.isChecked ?
                                        <td>
                                            <Button color='primary' onClick={() => handleUpdate(row.values)} disabled={row.values.isError}>
                                                save
                                            </Button>
                                            &nbsp;
                                            <Button color='danger' onClick={() => handleRemove(row)}>
                                                delete
                                            </Button>
                                        </td>
                                        :
                                        <React.Fragment />
                                }
                            </tr>
                        )
                    })}
                </tbody>
            </table >
            <div className="pagination" style={{ marginTop: 15 }} >
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <span>
                    <strong>
                        &nbsp;{pageIndex + 1}&nbsp;
                    </strong>
                </span>

                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}


            </div>
        </div>
    )
}

export default CustomTable;