import * as Yup from 'yup';

const CredentialsScheme = Yup.object().shape({
  _id: Yup.string()
    .matches(/[a-zA-Z0-9_. ]+/, 'Invalid character')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, 'Password is not strong enough')
    .min(8, 'Too Short!')
    .max(30, 'Too Long!')
    .required('Required'),
});

export default CredentialsScheme;
