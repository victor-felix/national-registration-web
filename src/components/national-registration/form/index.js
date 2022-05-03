import React, { useCallback, useRef } from 'react';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import { Form } from '@unform/web';
import { TextField, Switch } from 'unform-material-ui';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { useLoading } from '~/hooks/loading';

import getValidationErrors from '~/utils/getValidationErrors';

import { NationalRegistrationMask } from '~/components/mask/national-registration';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #999',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '375px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonRight: {
    marginLeft: '5px',
  },
  buttonLeft: {
    marginRight: '5px',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '200px',
  },
}));

export default function form({
  nationalRegistration,
  send,
  open,
  handleClose,
}) {
  const classes = useStyles();
  const formRef = useRef(null);
  const { loadingShowed, showLoading, hideLoading } = useLoading();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        formRef.current.setErrors({});

        const schema = Yup.object().shape({
          number: Yup.string()
            .test(
              'test-cpf-cnpj',
              'CPF/CNPJ inválido.',
              (value) =>
                cpf.isValid(value.replace(/\D/g)) ||
                cnpj.isValid(value.replace(/\D/g))
            )
            .required('Este campo é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        showLoading();
        await send(nationalRegistration.id || null, {
          ...data,
          number: data.number.replace(/\D/g, ''),
        });
        hideLoading();
        handleClose();
      } catch (err) {
        hideLoading();
        if (err.inner) {
          const errors = getValidationErrors(err);
          formRef.current.setErrors(errors);
          return;
        }

        if (
          err.response &&
          err.response.data === 'National registration already exists error.'
        ) {
          toast.error('CPF/CNPJ já cadastrado.');
          return;
        }

        if (err.message === 'Network Error') {
          toast.error(
            'Serviço temporareamente indisponível, tente novamente mais tarde.'
          );
          return;
        }

        toast.error('Falha ao tentar cadastrar o CPF/CNPJ.');
      }
    },
    [hideLoading, showLoading, send, nationalRegistration, handleClose]
  );

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Form
              onSubmit={handleSubmit}
              initialData={nationalRegistration}
              ref={formRef}
              className={classes.form}
            >
              <Typography variant="h6" color="textPrimary">
                {(nationalRegistration.id && 'Atualizar ') || 'Cadastrar '}
                CPF/CNPJ
              </Typography>
              <TextField
                name="number"
                disabled={loadingShowed}
                variant="outlined"
                color="primary"
                fullWidth
                margin="normal"
                label="CPF/CNPJ"
                size="small"
                InputProps={{
                  inputComponent: NationalRegistrationMask,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControlLabel
                control={
                  <Switch name="blocked" label="Bloqueado" color="primary" />
                }
                color="primary"
                label={<Typography color="textPrimary">Bloqueado</Typography>}
              />

              <div className={classes.buttons}>
                <Button
                  disabled={loadingShowed}
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}
                  fullWidth
                  className={classes.buttonLeft}
                  size="small"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loadingShowed}
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.buttonRight}
                  size="small"
                >
                  Salvar
                </Button>
              </div>
            </Form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

form.propTypes = {
  nationalRegistration: PropTypes.shape(), //eslint-disable-line
  send: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

form.defaultProps = {
  nationalRegistration: {},
};
