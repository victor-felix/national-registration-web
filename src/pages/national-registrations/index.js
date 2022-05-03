import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Paper,
  IconButton,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TextField,
  Typography,
} from '@material-ui/core';
import { DeleteForever, Edit, Add, Done, Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';

import { useLoading } from '~/hooks/loading';

import api from '~/services/api';

import FormNationalRegistrationModal from '~/components/national-registration/form';
import { NationalRegistrationMask } from '~/components/mask/national-registration';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  filter: {
    padding: theme.spacing(2),
  },
  filterButton: {
    margin: theme.spacing(0, 1),
  },
}));

export default function NationalRegistrations() {
  const classes = useStyles();
  const confirm = useConfirm();
  const { loadingShowed } = useLoading();

  const [nationalRegistrationsList, setNationalRegistrationsList] =
    useState(null);
  const [formNationalRegistration, setFormNationalRegistration] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [filters, setFilters] = useState({
    take: 10,
    skip: 1,
    blocked: false,
  });

  const getNationalRegistrations = async () => {
    try {
      const response = await api.get('/v1/national-registration', {
        params: filters,
      });
      setNationalRegistrationsList(response.data);
    } catch (error) {
      toast.error('Falha ao recuperar os registros.');
    }
  };

  const deleteNationalRegistration = async (id) => {
    try {
      const response = await api.delete(`/v1/national-registration/${id}`);
      setNationalRegistrationsList(response.data);
      toast.success('Operação realizada com sucesso.');
    } catch (error) {
      toast.error('Falha ao tentar deletar registro.');
    }
  };

  useEffect(() => {
    if (!nationalRegistrationsList) {
      getNationalRegistrations();
    }
  }, [nationalRegistrationsList]); // eslint-disable-line

  useEffect(() => {
    getNationalRegistrations();
  }, [filters]); // eslint-disable-line

  const handleChangePage = (event, newPage) => {
    const newFilters = { ...filters, skip: newPage + 1 };
    setFilters(newFilters);
  };

  const handleChangeRowsPerPage = (event) => {
    const newFilters = { ...filters, take: Number(event.target.value) };
    setFilters(newFilters);
  };

  const handleDeleteNationalRegistration = (id) => {
    confirm({
      title: 'Deseja continuar?',
      description: 'Clicando em confirmar, o CPF/CNPJ será excluído.',
    })
      .then(() => {
        deleteNationalRegistration(id);
        getNationalRegistrations();
      })
      .catch(() => {});
  };

  const handleChangeForm = (event) => {
    let newFilters = { ...filters };

    if (!event.target.value) {
      delete newFilters[event.target.name];
    } else {
      newFilters = {
        ...newFilters,
        [event.target.name]: event.target.value.replace(/\D/g, ''),
      };
    }
    setFilters(newFilters);
  };

  const handleChangeCheckbox = (event) => {
    let newFilters = { ...filters };

    if (newFilters[event.target.name]) {
      delete newFilters[event.target.name];
      setFilters(newFilters);
      return;
    }

    if (newFilters[event.target.name] === undefined) {
      newFilters = {
        ...newFilters,
        [event.target.name]: false,
      };
      setFilters(newFilters);
      return;
    }

    newFilters = {
      ...newFilters,
      [event.target.name]: true,
    };
    setFilters(newFilters);
  };

  const saveNationalRegistration = async (id = null, data) => {
    if (id) {
      await api.put(`/v1/national-registration/${id}`, data);
    } else {
      await api.post(`/v1/national-registration`, data);
    }
    getNationalRegistrations();
  };

  const handleOpenForm = (nationalRegistration = {}) => {
    setFormNationalRegistration(nationalRegistration);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const nationalRegistrationFormatted = (value) => {
    if (value.length === 11) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return value.replace(
      /^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/,
      '$1.$2.$3/$4-$5'
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={2} className={classes.filter}>
              <Grid item xs={12}>
                <Typography variant="h5">Filtrar</Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  variant="outlined"
                  label="CPF/CNPJ"
                  name="number"
                  autoFocus
                  color="primary"
                  disabled={loadingShowed}
                  size="small"
                  fullWidth
                  onBlur={handleChangeForm}
                  InputProps={{
                    inputComponent: NationalRegistrationMask,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      indeterminate={filters.blocked === undefined}
                      color="primary"
                      name="blocked"
                      checked={filters.blocked}
                    />
                  }
                  label="Bloqueado"
                  onChange={handleChangeCheckbox}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item xs={12} sm={3} lg={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      startIcon={<Add />}
                      onClick={handleOpenForm}
                      size="small"
                    >
                      Cadastrar
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Número</TableCell>
                  <TableCell align="center">Bloqueado</TableCell>
                  <TableCell align="center">Editar</TableCell>
                  <TableCell align="center">Excluir</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nationalRegistrationsList &&
                  nationalRegistrationsList.data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">
                        {nationalRegistrationFormatted(row.number)}
                      </TableCell>
                      <TableCell align="center">
                        {row.blocked ? (
                          <Done color="error" />
                        ) : (
                          <Close color="primary" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => handleOpenForm(row)}
                        >
                          <Edit color="primary" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() =>
                            handleDeleteNationalRegistration(row.id)
                          }
                        >
                          <DeleteForever color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={
                (nationalRegistrationsList &&
                  nationalRegistrationsList.total) ||
                0
              }
              rowsPerPage={filters.take}
              page={filters.skip - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Registros por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </TableContainer>
        </Grid>
      </Grid>
      <FormNationalRegistrationModal
        send={saveNationalRegistration}
        open={openForm}
        handleClose={handleCloseForm}
        nationalRegistration={formNationalRegistration}
      />
    </>
  );
}
