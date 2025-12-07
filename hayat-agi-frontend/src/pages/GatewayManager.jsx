import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Stack,
    TextField,
    MenuItem,
    InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { getGateways, deleteGateway } from '../api/gatewayService';

const GatewayManager = () => {
    const [gateways, setGateways] = useState([]);


    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getGateways();
            setGateways(data);
        } catch (error) {
            console.error("Veri yüklenemedi", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu cihazı silmek istediğinize emin misiniz?')) {
            await deleteGateway(id);
            loadData();
        }
    };


    const filteredGateways = gateways.filter((gw) => {

        if (searchTerm && !gw.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        if (statusFilter !== 'all' && gw.status !== statusFilter) {
            return false;
        }
        return true;
    });

    return (
        <Container sx={{ py: 4 }}>


            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Gateway Yönetimi
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/dashboard/add-gateway"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                    Yeni Gateway Ekle
                </Button>
            </div>


            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={0} variant="outlined">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* Arama */}
                    <TextField
                        placeholder="Cihaz adı ile ara..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1 }}
                    />


                    <TextField
                        select
                        label="Durum Filtresi"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        size="small"
                        sx={{ minWidth: 200 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterListIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="all">Tümü</MenuItem>
                        <MenuItem value="active">Aktif</MenuItem>
                        <MenuItem value="inactive">Pasif</MenuItem>
                        <MenuItem value="low_battery">Düşük Pil</MenuItem>
                    </TextField>
                </Stack>
            </Paper>

            {/* TABLO ALANI */}
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cihaz Adı</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Batarya</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {filteredGateways.length > 0 ? (
                            filteredGateways.map((gw) => (
                                <TableRow key={gw._id} hover>
                                    <TableCell>{gw.name}</TableCell>
                                    <TableCell>

                                        {gw.status}
                                    </TableCell>
                                    <TableCell>%{gw.battery}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error" onClick={() => handleDelete(gw._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                    Aradığınız kriterlere uygun cihaz bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
};

export default GatewayManager;