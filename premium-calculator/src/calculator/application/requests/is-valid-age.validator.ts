import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isValidAge', async: false })
export class IsValidAge implements ValidatorConstraintInterface {
  validate(age: number, args: ValidationArguments) {
    const { object } = args;
    const dateOfBirth = (object as any).dateOfBirth;
    if (!dateOfBirth) return false;

    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    let calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    return calculatedAge === age;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Age must be consistent with Date of Birth';
  }
}