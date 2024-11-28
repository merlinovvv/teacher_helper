import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useLogin } from './data/useAuthorization.js';
import { Form, Formik } from 'formik';
import { LayoutContext } from '../../../../context/LayoutContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { checkToken } from '../../../../shared/utils/utils.js';
import TextField from '../../../../shared/fields/TextField/TextField.jsx';
import PasswordField from '../../../../shared/fields/PasswordField/PasswordField.jsx';

function Login({ setIsLoginType }) {
  const navigate = useNavigate();
  const { setIsLogin, setAccessToken, toast } = useContext(LayoutContext);
  const [payload, setPayload] = useState();
  const { data: loginData, mutate: getLogin, isSuccess: loginSuccess, isPending: loginLoading } = useLogin(payload);

  const initialValues = {
    username: '',
    password: '',
  };

  async function handleSubmit(values) {
    await setPayload(values);
    await getLogin();
  }

  useEffect(() => {
    if (loginSuccess && loginData) {
      if (loginData?.success) {
        localStorage.setItem('access_token', loginData?.response?.token);
        setAccessToken(loginData?.response?.token);
        setIsLogin(checkToken(loginData?.response?.token));
        navigate('/');
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
    <Formik initialValues={initialValues} onSubmit={async (values) => handleSubmit(values)}>
      {({ values, handleChange }) => (
        <Form className="flex align-items-center m-4 justify-content-center lg:w-4 w-23rem">
          <div className="p-6 border-round-3xl mr-0 w-full surface-card border-gray-300 shadow-4">
            <div className="text-center mb-5">
              <div className="text-900 text-5xl font-medium mb-3">Вітаємо!</div>
            </div>
            <div className="formgrid grid">
              <TextField label="Ім'я користувача" name="username" onChange={handleChange} value={values?.username} />
              <PasswordField label="Пароль" name="password" onChange={handleChange} value={values?.password} />
              <div className="field col-12">
                <Button loading={loginLoading} label="Увійти" icon="pi pi-user" className="w-full" />
              </div>

            </div>
            <div className="font-bold text-center w-full mt-3 text-color">Не маєте аккаунту?
              <span onClick={() => setIsLoginType(false)} className="p-link text-primary-500 underline">Зареєструйтесь.</span></div>
          </div>
        </Form>
      )}
    </Formik>

  );
}

export default Login;
