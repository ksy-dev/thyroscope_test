import React, { useEffect, useMemo, useState } from 'react';
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { Button, Container } from 'reactstrap';
import './App.css';
import AddForm from './components/AddForm';

let tableData = [
  {
    username: 'John',
    email: 'john@thyroscope.com',
    nickname: 'moderator',
    gender: 'male',
    isChecked: false,
    isError: false,
  },
  {
    username: 'Frank',
    email: 'frank@thyroscope.com',
    nickname: 'mafia1',
    gender: 'male',
    isChecked: false,
    isError: false,
  },
  {
    username: 'Julie',
    email: 'julie@thyroscope.com',
    nickname: 'civilian2',
    gender: 'female',
    isChecked: false,
    isError: false,
  },
  {
    username: 'Steve',
    email: 'steve@thyroscope.com',
    nickname: 'civilian1',
    gender: 'male',
    isChecked: false,
    isError: false,
  },
]

const columnData = [
  {
    accessor: 'isError',
    Header: '',
  },
  {
    accessor: 'isChecked',
    Header: '',
  },
  {
    accessor: 'username',
    Header: 'username',
    width: 200
  },
  {
    accessor: 'email',
    Header: 'email',
    disableGlobalFilter: true,
    width: 200
  },
  {
    accessor: 'nickname',
    Header: 'nickname',
    disableGlobalFilter: true,
    width: 200
  },
  {
    accessor: 'gender',
    Header: 'gender',
    disableGlobalFilter: true,
    width: 200
  },
]

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
        id != 'gender' ?
          <input name={id} style={{ border: err ? '2px solid red' : '1px solid gray' }} value={value} onChange={onChange} onBlur={onBlur} /> :
          <select style={{ height: 30, width: 90 }} name={values.name} defaultValue={values.gender}>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
      ) :
      value
  )
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
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

function App() {

  const columns = useMemo(() => columnData, []);
  const [listData, setListData] = useState(tableData);
  const data = useMemo(() => listData, [listData]);
  console.log('table data is ', data)
  const [originalData, setOriData] = useState(tableData);//useMemo(() => tableData, []);
  const [inputData, setInputData] = useState({ username: '', email: '', nickname: '', gender: '', isError: false, isChecked: false });



  const handleChange = (name, value) => {
    setInputData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRemove = (rows) => {
    const newArr = [...data];
    newArr.splice(rows.index, 1);
    console.log('new arr', newArr);
    setListData(newArr);
  }

  const handleChecked = (item, index, e) => {
    console.log(item, index, e);
    let newArr = [...data];
    console.log('originalData ', originalData)
    if (!e.target.checked) {
      let oriData = originalData[index];
      newArr[index] = oriData;

      console.log('oriData ', oriData)
    }
    else {
      newArr[index] = { ...item, isChecked: e.target.checked };
    }
    console.log('check ', newArr)
    setListData(newArr);
  }

  const handleUpdate = (item) => {
    const exists = data.find(p => p.email === inputData.email);
    if (exists) {
      return alert('이미 등록된 이메일이 존재합니다.');
    }

    let index = data.findIndex((element) => element.email == item.email);
    let newArr = [...data];
    newArr[index] = { ...item, isChecked: false, isErr: false };

    setListData(newArr);
    setOriData(newArr);
  }

  const handleValidSubmit = (e) => {
    const exists = data.find(p => p.email === inputData.email);
    if (exists) {
      return alert('이미 등록된 이메일이 존재합니다.');
    }
    setListData([...data, inputData]);
    setOriData([...data, inputData]);
    setInputData({ username: '', email: '', nickname: '', gender: '', isError: false, isChecked: false });
  }

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setListData(old =>
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
    <Container>
      <AddForm onSubmit={handleValidSubmit} onChangeValue={handleChange} data={inputData} />
      <div style={{ marginLeft: 30 }}>
        <h2 style={{ marginTop: 30 }}>Users</h2>
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
    </Container >
  );
}

export default App;
