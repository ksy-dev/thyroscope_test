import React, { useMemo, useState } from 'react';
import { Container } from 'reactstrap';
import './App.css';
import AddForm from './components/AddForm';
import CustomTable from './components/CustomTable';
import { columnData, tableData } from './DataSoruce';


function App() {

  const columns = useMemo(() => columnData, []);
  const [listData, setListData] = useState(tableData);
  const data = useMemo(() => listData, [listData]);

  const [originalData, setOriData] = useState(tableData);
  const [inputData, setInputData] = useState({ username: '', email: '', nickname: '', gender: '', isError: false, isChecked: false });

  /// 행 추가 관련
  const handleChange = (name, value) => {
    setInputData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleValidSubmit = (e) => {
    const exists = data.find(p => p.email === inputData.email);
    if (exists) {
      return alert('이미 등록된 이메일이 존재합니다.');
    }
    setListData([...data, inputData]);
    setOriData([...data, inputData]);
    setInputData({ username: '', email: '', nickname: '', gender: '', isError: false, isChecked: false });
  }
  ///
  
  return (
    <Container>
      <AddForm onSubmit={handleValidSubmit} onChangeValue={handleChange} data={inputData} />
      <div style={{ marginLeft: 30 }}>
        <h2 style={{ marginTop: 30 }}>Users</h2>
        <CustomTable
          columns={columns}
          data={data}
          originalData={originalData}
          inputData={inputData}
          onUpdateData={(newArr) => setListData(newArr)}
          onUpdateOriData={(newArr) => setOriData(newArr)}
        />
      </div>
    </Container >
  );
}

export default App;
