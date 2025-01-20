import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useActionsAuthorization } from 'features/authorization/hooks/use-actions-authorization';

const regList = [
{label: "Логин", name: "login"}, {label: "Имя", name: "firstname"},
{label: "Фамилия", name: "lastname"}, {label: "Пароль", name: "password"},
{label: "Подтверждение пароля", name: "confirmPassword"}]

const getInitialState = () => {
  const newInitialState: { [key: string]: string } = {};
    
  regList.forEach((item) => {
    newInitialState[item.name] = "";
  });

  return newInitialState;
};

const authKeyList = ["login", "password"]

interface IFormData {
    [key: string]: string;
}

export const AuthForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const handleActions = useActionsAuthorization();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<IFormData>(() => getInitialState());
  const [errors, setErrors] = useState(() => getInitialState());
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  useEffect(() => {
    validateForm()
  }, [formData])

  const validateField = (name: string, value: string) => {
    let error = '';
    
    if (value.trim().length < 3) {
      error = 'Минимум 3 символа';
    }

    if (name === 'confirmPassword' && value !== formData.password) {
      error = 'Пароли не совпадают';
    }
    
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const isValid =
      formData.login.trim().length >= 3 &&
      formData.firstname.trim().length >= 3 &&
      formData.lastname.trim().length >= 3 &&
      formData.password.trim().length >= 3 &&
      formData.confirmPassword === formData.password;
    setIsFormValid(isValid);
  };

  const handleSwitchMode = () => {
    setIsRegister((prev) => !prev);
    clearFormData()
  };

  const clearFormData = () => {
    setFormData(() => getInitialState());
    setErrors(() => getInitialState());
    setIsFormValid(false);
  }

  const handleSubmit = () => {
    if (isRegister) {
      handleActions('register', formData);
    } else {
      handleActions('login', formData);
    }
    onClose();
    clearFormData();
    setIsRegister(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isRegister ? 'Регистрация' : 'Авторизация'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <>
            {regList.map((item) => {
              if (isRegister || authKeyList.includes(item.name)) {
                return (
                  <TextField
                    key={item.name}
                    label={item.label}
                    type={
                      item.name === 'password' || item.name === 'confirmPassword'
                        ? 'password'
                        : item.name
                    }
                    name={item.name}
                    value={formData[item.name as keyof IFormData]}
                    onChange={handleInputChange}
                    fullWidth
                    error={isRegister && !!errors[item.name as keyof typeof errors]}
                    helperText={isRegister ? errors[item.name as keyof typeof errors] : ''}
                  />
                );
              }
              return null;
            })}
          </>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Выйти
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isRegister && !isFormValid}
        >
          {isRegister ? 'Регистрация' : 'Войти'}
        </Button>
        <Button onClick={handleSwitchMode} variant="contained" color="inherit">
          {isRegister ? 'Уже есть аккаунт' : 'Создать аккаунт'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
