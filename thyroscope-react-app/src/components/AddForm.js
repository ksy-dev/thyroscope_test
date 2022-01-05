import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Col, Container, Row } from 'reactstrap';
import * as Yup from 'yup';
import CustomInput from './CustomInput';
import AddFormStyle from "./AddFormStyle.css";

//유효성 스키마
const Schema = Yup.object().shape({
    username: Yup.string()
        .min(3, '3자 이상 입력해주세요.')
        .required('이름을 입력해주세요.'),
    nickname: Yup.string()
        .min(3, '3자 이상 입력해주세요.')
        .required('별명을 입력해주세요.'),
    email: Yup.string() //이메일
        .email('올바른 이메일 형식을 입력해주세요.')
        .required('이메일을 입력해주세요.'),
    gender: Yup.string()
        .required('성별을 선택해주세요.'),
});

const AddForm = ({ onSubmit, onChangeValue, data }) => (
    <div style={{ marginTop: 30 }}>
        <Formik
            enableReinitialize
            initialValues={data}
            onSubmit={(values) => onSubmit(values)}
            validationSchema={Schema}
            validateOnChange={false}
            validateOnBlur={false}
        >
            {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
                <Form>
                    <Container>
                        <h2>Add user</h2>
                        <Row>
                            <Col xs="auto">
                                <Col>
                                    <CustomInput
                                        maxLength={10}
                                        label='username'
                                        name='username'
                                        errors={errors}
                                        touched={touched}
                                        value={values.username}
                                        onChange={onChangeValue}
                                        onBlur={setFieldTouched}
                                        placeholder=''
                                    />
                                </Col>
                            </Col>
                            <Col xs="auto">
                                <CustomInput
                                    maxLength={30}
                                    label='email'
                                    name='email'
                                    errors={errors}
                                    touched={touched}
                                    value={values.email}
                                    onChange={onChangeValue}
                                    onBlur={setFieldTouched}
                                    placeholder=''
                                />
                            </Col>
                            <Col xs="auto">
                                <CustomInput
                                    maxLength={15}
                                    label='nickname'
                                    name='nickname'
                                    errors={errors}
                                    touched={touched}
                                    value={values.nickname}
                                    onChange={onChangeValue}
                                    onBlur={setFieldTouched}
                                    placeholder=''
                                />
                            </Col>
                            <Col xs="auto">
                                {/* <label>gender</label> */}
                                <Col>
                                    <CustomInput
                                        label='gender'
                                        name='gender'
                                        as='select'
                                        errors={errors}
                                        touched={touched}
                                        value={values.gender}
                                        onChange={onChangeValue}
                                        onBlur={setFieldTouched}

                                    >
                                        <option value="">Select</option>
                                        <option value="male">male</option>
                                        <option value="female">female</option>
                                    </CustomInput>
                                </Col>
                            </Col>
                            <Col></Col>
                        </Row>
                        <div style={{ paddingTop: 10 }}>
                            <Button type='submit' >Add</Button>
                        </div>
                    </Container>
                </Form>
            )}
        </Formik>
    </div>
);
export default AddForm;