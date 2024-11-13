import * as Yup from 'yup';
import moment from 'moment';

export const profileValidationSchema = Yup.object().shape({
  name: Yup.string().min(1).max(14).required(),
  gender: Yup.string().required(),
  birthday: Yup.string()
    .required()
    .test('Date of Birth', 'Should be greather than 18', function (value) {
      return moment().diff(moment(value), 'years') >= 18;
    }),
});
