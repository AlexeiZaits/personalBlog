import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import $client from 'shared/api';

const regList = [
{label: "Логин", name: "login"}, {label: "Имя", name: "firstName"},
{label: "Фамилия", name: "lastName"}, {label: "Пароль", name: "password"},
{label: "Подтверждение пароля", name: "confirmPassword"}]

const authKeyList = ["login", "password"]

interface IFormData {
    [key: string]: string;
}

export const AuthForm = ({ open, onClose } : {
    open: boolean;
    onClose: () => void;
  }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    login: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchMode = () => {
    setIsRegister((prev) => !prev);
    setFormData({
      login: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleSubmit = () => {
    if (isRegister) {
      // Handle Registration
      console.log('Registering:', formData);
    } else {
      // Handle Login
      $client.post("http://localhost:3000/auth/register", {
        username: formData.login,
        password: formData.password,
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
      console.log('Logging in:', formData.login, formData.password);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isRegister ? 'Регистрация' : 'Авторизация'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
            <>
              {regList.map((item) => {
                if (isRegister || authKeyList.includes(item.name))
                return <TextField
                key={item.name}
                label={item.label}
                name={item.name}
                value={formData[`${item.name}`]}
                onChange={handleInputChange}
                fullWidth
                />
              })}
            </>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {isRegister ? 'Register' : 'Login'}
        </Button>
        <Button onClick={handleSwitchMode} color="inherit">
          {isRegister ? 'Already have an account? Login' : 'Create an account'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};