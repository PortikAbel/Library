import * as Yup from 'yup';

const RegisterScheme = Yup.object().shape({
  isbn: Yup.string()
    .matches(/[0-9]+/, 'Must be a number')
    .min(13, 'Too Short!')
    .max(13, 'Too Long!')
    .required('Required'),
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(30, 'Too Long!')
    .required('Required'),
  author: Yup.string()
    .min(2, 'Too Short!')
    .max(30, 'Too Long!')
    .required('Required'),
  summary: Yup.string()
    .max(100, 'Too long!'),
  copies: Yup.number()
    .integer('Must be integer')
    .positive('Must be positive'),
});

export default RegisterScheme;
