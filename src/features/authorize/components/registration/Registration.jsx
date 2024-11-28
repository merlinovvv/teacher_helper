import React, { useContext, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import TextField from '../../../../shared/fields/TextField/TextField.jsx';
import PasswordField from '../../../../shared/fields/PasswordField/PasswordField.jsx';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutContext } from '../../../../context/LayoutContext.jsx';
import { useReg } from './data/useRegistration.js';
import * as Yup from 'yup'

function Registration({setIsLoginType}) {
  const navigate = useNavigate();
  const { setIsLogin, setAccessToken, toast } = useContext(LayoutContext);
  const [payload, setPayload] = useState();
  const { data: loginData, mutate: getLogin, isSuccess: loginSuccess, isPending: loginLoading } = useReg(payload);

  const initialValues = {
    email: '',
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email не коректний!').required("Email обов'язковий!"),
    username: Yup.string().required("Ім'я користувача обов'язкове!"),
    password: Yup.string().min(8, 'Мінімум 8 символів').required("Пароль обо'язковий!")
  })

  async function handleSubmit(values) {
    await setPayload(values);
    await getLogin();
  }

  useEffect(() => {
    if (loginSuccess && loginData) {
      if (loginData?.success) {
        toast.current.show({
          summary: 'Авторизація',
          detail: loginData?.message,
          severity: 'success',
        });
        localStorage.setItem('access_token', loginData?.response?.token);
        setAccessToken(loginData?.response?.token);
        navigate('/payment')
      } else {
        toast.current.show({
          summary: 'Авторизація',
          detail: loginData?.message,
          severity: 'error',
        });
      }
    }
  }, [loginSuccess, loginData]);

  return (
    <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={async (values) => handleSubmit(values)}>
      {({ values, handleChange }) => (
        <Form className="flex align-items-center m-4 justify-content-center lg:w-4 w-23rem">
          <div className="p-6 border-round-3xl mr-0 w-full surface-card border-gray-300 shadow-4">
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3">Реєстрація</div>
            </div>
            <div className="formgrid grid">
              <TextField label="Ім'я користувача" name="username" onChange={handleChange} value={values?.username} />
              <TextField label="Email" name="email" onChange={handleChange} value={values?.email} />
              <PasswordField label="Пароль" name="password" onChange={handleChange} value={values?.password} />
              <Button loading={loginLoading} label="Зареєструватися" icon="pi pi-user" className="w-full" />
              <span className="font-bold text-center w-full mt-3 text-color">Вже маєте аккаунт? <span onClick={() => setIsLoginType(true)} className="p-link text-primary-500 underline">Увійдіть.</span></span>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default Registration;