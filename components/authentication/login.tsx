import React, { FC, useState } from 'react';
import './authentication.scss';
import Store from '../../stores';
import { inject, observer } from 'mobx-react';
import { Router } from '../../routes';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type Props = {
  store?: Store
};
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Too Short')
});

const Login: FC<Props> = ({ store }) => {
  const { auth: { login } } = store!;

  const handleServerErrors = (errors: Array<any>, setFieldError: (field: string, message: string) => void) => {
    let flags = { email: true, password: true };
    errors.forEach(e => {
      if (e.param === 'email' && flags.email) {
        setFieldError('email', e.msg);
        flags.email = false;
      }
      if (e.param === 'password' && flags.password) {
        setFieldError('password', e.msg);
        flags.password = false;
      }
    });
  };

  return (
    <div className="auth-container d-flex align-items-center" style={{ backgroundImage: `url(${require('../../public/images/auth-background.jpg')})` }}>
      <div className="overlay"></div>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-5 ">
            <div className="auth-box">
              <h3 className="auth-box__header">Login</h3>
              <Formik
                initialValues={{
                  password: '',
                  email: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                  const result = await login({ email: values.email, password: values.password });
                  const { auth } = result;
                  if (auth) {
                    Router.pushRoute('home');
                  }
                  else {
                    const { errors } = result;
                    handleServerErrors(errors, setFieldError);
                  }
                  setSubmitting(false);
                }}
              >
                {({ errors, touched, values, isSubmitting }) => (

                  <Form noValidate>
                    <div className="form-group">
                      <Field name="email" type="email" className="form-control input-text" aria-describedby="emailHelp" placeholder=' ' required />
                      <span className="placeholder"><i className="fa fa-user mr-3"></i>Enter your email</span>
                      <ErrorMessage name="email" component="div" className="errors--error" />
                    </div>
                    <div className="form-group">
                      <Field name="password" type="password" className="form-control input-text" aria-describedby="passwordHelp" placeholder=' ' required />
                      <span className="placeholder"><i className="fa fa-user mr-3"></i>Enter your password</span>
                      <ErrorMessage name="password" component="div" className="errors--error" />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className='btn btn-lg btn-dark submit-btn' disabled={isSubmitting}>Login</button>
                    </div>

                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
};

export default inject('store')(observer(Login));